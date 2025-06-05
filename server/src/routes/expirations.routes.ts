import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { getExpirations } from "../controllers/Expirations/expirations.controller";

const expirationsRouter = Router()

const GetExpirationsRouter: RequestHandler<
{},{},{},{business_id: string}
> = (req, res, next) => {
    const {business_id} = req.query
    if(!business_id){
        res.status(400).json({msg:"El ID del negocio es obligatorio."})
        return
    }
    next()
}

expirationsRouter.get("/get-expirations", ValidateSessionRouter,GetExpirationsRouter, getExpirations)


export default expirationsRouter