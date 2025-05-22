import { RequestHandler, Router } from "express";
import { DebtRequest } from "../Types/DebtsTypes";
import { ValidateSessionRouter } from "./auth.routes";
import { deleteDebt, saveDebt } from "../controllers/Debts/debts.controller";

const debtRouter = Router()

const SaveDebtRouter: RequestHandler<
    {}, {},
    DebtRequest, { client_id: string }> = async (
        req,
        res,
        next
    ): Promise<void> => {
        const { manager_id } = (req as any).manager_data
        const { client_id } = req.query
        const {
            debt_date,
            debt_products,
            debt_total
        } = req.body

        if ([null, undefined, ""].includes(manager_id)) {
            res.status(401).json({ msg: "Acceso no autorizado." })
            return
        }
        if ([null, undefined, ""].includes(client_id)) {
            res.status(400).json({ msg: "El ID del cliente es obligatorio." })
            return
        }
        if ([null, undefined, ""].includes(debt_date)) {
            res.status(400).json({ msg: "La fecha es obligatoria." })
            return
        }

        if (!debt_products || debt_products.length === 0) {
            res.status(400).json({ msg: "Los productos son obligatorios." })
            return
        }
        if ([null, undefined, ""].includes(debt_total.toString())) {
            res.status(400).json({ msg: "El total es obligatorio." })
            return
        }

        next()
    }

const DeleteDebtRouter: RequestHandler<
    {}, 
    {}, 
    {}, {
        debt_id: string
        client_id: string
    }
> = async (
    req, res, next
): Promise<void> => {
        const {
            client_id, debt_id
        } = req.query
        const { manager_id } = (req as any).manager_data
        if ([null, undefined, ""].includes(manager_id)) {
            res.status(401).json({ msg: "Acceso no autorizado." })
            return
        }
        if ([null, undefined, ""].includes(client_id)) {
            res.status(400).json({ msg: "El ID del cliente es obligatorio." })
            return
        }
        console.log("ID DE LA DEUDA", debt_id)
        if ([null, undefined, ""].includes(debt_id)) {
            res.status(400).json({ msg: "El ID de la deuda es obligatorio." })
            return
        }
        next()
    }
debtRouter.post("/save-debt", ValidateSessionRouter, SaveDebtRouter, saveDebt)
debtRouter.delete("/delete-debt", ValidateSessionRouter, DeleteDebtRouter, deleteDebt)
export default debtRouter