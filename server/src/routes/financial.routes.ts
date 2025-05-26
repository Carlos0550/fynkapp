import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { getFinancialData } from "../controllers/FinancialData/FinancialData.controller";

const financialRouter = Router()

const GetFinancialDataRouter: RequestHandler<
{},{},{},{client_id:string}
> = async (
    req, res, next
): Promise<void> => {
    if(!(req as any).manager_data){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }

    if(!req.query.client_id){
        res.status(400).json({msg:"El ID del cliente es obligatorio."})
        return
    }
    next()
}


financialRouter.get("/get-financial-data", ValidateSessionRouter, GetFinancialDataRouter, getFinancialData)

export default financialRouter