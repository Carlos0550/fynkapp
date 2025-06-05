import { RequestHandler } from "express";
import pool from "../../connections/database_conn";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import dayjs from "dayjs";
import { decrypt } from "../../Security/EncryptationModule";
const queries = getQueries(path.join(__dirname, "./Queries"));

const notificationsServerURL = process.env.NODE_ENV === "production"
    ? "https://notifications.fynkapp.com.ar"
    : "http://localhost:5005";

export const dueReminders: RequestHandler<
    {}, {}, {}, { client_id: string }
> = async (req, res): Promise<void> => {
    const { manager_id } = (req as any).manager_data;
    const { client_id } = req.query;
    const PRR = queries["dueReminders.sql"];

    try {
        const result = await pool.query(PRR[0], [client_id]);
        const result2 = await pool.query(PRR[1], [manager_id])
        const {
            client_name,
            client_aditional_data,
            total_debt,
            total_delivers,
            debt_products,
            exp_dates
        } = result.rows[0];
        console.log(exp_dates)
        const decryptedData = {
            client_phone: client_aditional_data.client_phone ? decrypt(client_aditional_data.client_phone) : null,
            client_email: client_aditional_data.client_email ? decrypt(client_aditional_data.client_email) : null
        }

        const businessData = result2.rows[0];

        const channel = businessData.notif_option;

        const sendHistory = await pool.query(PRR[3], [
            client_id,
            businessData.business_id,
        ]);

        let alreadySent: boolean = false;
        if (sendHistory.rowCount! > 0) {
            alreadySent = dayjs(sendHistory.rows[0].notif_at).isSame(dayjs(), "day");
        }

        if (alreadySent) {
            res.status(400).json({ msg: `El cliente ya recibió un recordatorio hoy.` });
            return;
        }

        const totalAmount = (Number(total_debt) - Number(total_delivers)).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'
        });

        const vencimientoMasViejo = result.rows[0].exp_dates?.[0];
        const daysDifference = vencimientoMasViejo
            ? dayjs().startOf('day').diff(dayjs(vencimientoMasViejo).startOf('day'), 'day')
            : 0;

        const dias = daysDifference === 0
            ? "venció hoy"
            : daysDifference > 0
                ? `se encuentra vencida hace ${daysDifference} día${daysDifference > 1 ? "s" : ""}`
                : daysDifference === -1
                    ? "vence mañana"
                    : `vence dentro de ${Math.abs(daysDifference)} día${Math.abs(daysDifference) > 1 ? "s" : ""}`;


       
        const fecha_vencimiento = dayjs(vencimientoMasViejo).format("DD/MM/YYYY");
        console.log("Fecha de vencimiento:", fecha_vencimiento);
        const url = new URL(notificationsServerURL + "/wa-notifications/due-reminders");

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                channel,
                totalAmount,
                dias,
                productos: debt_products,
                fecha_vencimiento,
                client_name: client_name,
                client_phone: decryptedData.client_phone,
                client_email: decryptedData.client_email,
                business_name: businessData.business_name,
                business_phone: businessData.business_phone,
                business_address: businessData.business_address,
            }),
        });

        const responseData = await response.json();
        const notif_channel = responseData.notif_channel;
        const notifStatus = response.status === 200 ? "sent" : "failed";
        const notif_type = "due_reminder";

        await pool.query(PRR[2], [
            businessData.business_id,
            client_id,
            notif_channel,
            notifStatus,
            dayjs().format("YYYY-MM-DD HH:mm:ss"),
            notif_type
        ]);

        if (response.status === 200) {
            res.status(200).json({ msg: "Recordatorio enviado exitosamente." });
            return
        } else {
            res.status(400).json({ msg: "Error al enviar el recordatorio." });
            return
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error interno en el servidor." });
    }
};
