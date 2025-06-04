import { RequestHandler } from "express";
import pool from "../../connections/database_conn";
import { PaymentReminderRequest } from "../../Types/NotificationsTypes";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import { BusinessData } from "../../Types/BusinessTypes";
import dayjs from "dayjs"
const queries = getQueries(path.join(__dirname, "./Queries"));

const notificationsServerURL = process.env.NODE_ENV === "production" ? "https://notifications.fynkapp.com.ar" : "http://localhost:5005"
export const dueReminders: RequestHandler<
{},{},PaymentReminderRequest,{}
> = async(req, res): Promise<void> => {
    const { manager_id } = (req as any).manager_data
    const {
        clientData,
        clientDebts,
        clientDelivers
    } = req.body
    const PRR = queries["dueReminders.sql"]
    try {
        const businessResult = await pool.query(PRR[0], [manager_id])

        const businessData:BusinessData = businessResult.rows[0]
        
        const sendHistory = await pool.query(PRR[2],[
            clientData.client_id,
            businessData.business_id,
        ])

        const alreadySent = dayjs(sendHistory.rows[0].notif_at).isSame(dayjs(), "day")

        if(alreadySent){
            res.status(400).json({msg:`El cliente ya recibio un recordatorio de pago, intenta de nuevo mañana.`})
            return
        }

        const url = new URL(notificationsServerURL + "/wa-notifications/due-reminders")

        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                businessData,
                clientData,
                clientDebts,
                clientDelivers
            })
        });
        const responseData = await response.json()
        const notif_channel = responseData.notif_channel
        const notifStatus = response.status === 200 ? "sent" : "failed"
        const notif_type = "due_reminder"
        if(response.status === 200){
            await pool.query(PRR[1],[
                businessData.business_id,
                clientData.client_id,
                notif_channel,
                notifStatus,
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                notif_type
            ])
            res.status(200).json({msg:"Recordatorio enviado exitosamente."})
            return;
        }else{
            await pool.query(PRR[1],[
                businessData.business_id,
                clientData.client_id,
                notif_channel,
                notifStatus,
                dayjs().format("YYYY-MM-DD HH:mm:ss"),
                notif_type
            ])
            res.status(400).json({msg:"Error al enviar el recordatorio."})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
}