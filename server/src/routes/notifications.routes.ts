import { Router, RequestHandler } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { dueReminders } from "../controllers/notifications/notifications.controller";

const notifRouter = Router()

const DueRemindersRouter: RequestHandler<
{},{},{},{client_id: string}
> = async(req, res, next): Promise<void> => {
    const {client_id} = req.query
    if(!client_id){
        res.status(400).json({msg:"Uno o más de los parámetros requeridos no fueron enviados en la solicitud."})
        return
    }
    next()
}

notifRouter.post("/send-notification", ValidateSessionRouter, DueRemindersRouter, dueReminders)

export default notifRouter