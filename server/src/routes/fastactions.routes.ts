const fastActionsRouter = require("express").Router();
import { NextFunction, Request, Response } from "express";
import { retrieveClientData, saveDeliver } from "../controllers/fastActions/fastActions.controller";
import { verifyToken } from "./Security/JWT";

interface AuthenticatedRequest<
    P = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = {}
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user_id: string;
}
fastActionsRouter.get("/retrieve-client-data", verifyToken,
    (
        req: AuthenticatedRequest<{}, {}, {}, { client_dni: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { client_dni } = req.query
        const { user_id } = req

        if (!user_id) {
            return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
        }

        if (!client_dni) {
            return res.status(400).json({ msg: "El DNI del Cliente no fue proporcionado." })
        }
        next()
    }, retrieveClientData)

fastActionsRouter.post("/save-deliver", verifyToken,
    (
        req: AuthenticatedRequest<{},{},{},{payment_amount: string, client_id: string}>,
        res: Response,
        next: NextFunction): void => {
        const { payment_amount, client_id } = req.query
        const { user_id } = req

        if (!user_id) {
            res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
            return
        }

        if (!client_id) {
            res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
            return
        }

        if (!payment_amount) {
            res.status(400).json({ msg: "Todos los campos son obligatorios." })
            return
        }

        if (isNaN(parseFloat(payment_amount)) || parseFloat(payment_amount) <= 0) {
            res.status(400).json({ msg: "El monto de entrega debe ser un numero valido." })
            return
        }

        next()
    }, saveDeliver)


export default fastActionsRouter
