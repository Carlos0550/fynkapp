import { Router, RequestHandler } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { PaymentReminderRequest } from "../Types/NotificationsTypes";
import { dueReminders } from "../controllers/notifications/notifications.controller";

const notifRouter = Router()

const DueRemindersRouter: RequestHandler<
{},{},PaymentReminderRequest,{}
> = async(req, res, next): Promise<void> => {
    const {
        clientData,
        clientDebts,
        clientDelivers
    } = req.body

    if(!clientData || !clientDebts || !clientDelivers){
        res.status(400).json({msg:"Uno o más de los parámetros requeridos no fueron enviados en la solicitud."})
        return
    }
    next()
}

notifRouter.post("/send-notification", ValidateSessionRouter, DueRemindersRouter, dueReminders)

export default notifRouter