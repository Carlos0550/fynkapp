import { RequestHandler } from "express";
import pool from "../../connections/database_conn";
import { PaymentReminderRequest } from "../../Types/NotificationsTypes";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";

const queries = getQueries(path.join(__dirname, "./Queries"));

const notificationsServerURL = process.env.NODE_ENV === "production" ? "https://notifications.fynkapp.com.ar" : "http://localhost:5005"
export const SendPaymentReminder: RequestHandler<
{},{},PaymentReminderRequest,{}
> = async(req, res): Promise<void> => {
    const { manager_id } = (req as any).manager_data
    const {
        clientData,
        clientDebts,
        clientDelivers
    } = req.body
    const PRR = queries["sendPaymentReminder.sql"]
    try {
        const businessResult = await pool.query(PRR[0], [manager_id])

        const businessData = businessResult.rows[0]

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

        if(response.status === 200){
            res.status(200).json({msg:"Recordatorio enviado exitosamente."})
            return;
        }else{
            res.status(400).json({msg:"Error al enviar el recordatorio."})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
}