import { RequestHandler, Router } from "express";
import { DebtRequest } from "../Types/DebtsTypes";
import { ValidateSessionRouter } from "./auth.routes";
import { saveDebt } from "../controllers/Debts/debts.controller";

const debtRouter = Router()

export const SaveDebtRouter: RequestHandler<
{},{},
DebtRequest,{client_id:string}> = async (
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

    if(!manager_id){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }
    if(!client_id){
        res.status(400).json({msg:"El ID del cliente es obligatorio."})
        return
    }
    if(!debt_date){
        res.status(400).json({msg:"La fecha es obligatoria."})
        return
    }

    if(!debt_products || debt_products.length === 0){
        res.status(400).json({msg:"Los productos son obligatorios."})
        return
    }
    if(!debt_total){
        res.status(400).json({msg:"El total es obligatorio."})
        return
    }

    next()
}

debtRouter.post("/save-debt", ValidateSessionRouter, SaveDebtRouter, saveDebt)
export default debtRouter