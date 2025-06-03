import { RequestHandler, Router } from "express";

import { ValidateSessionRouter } from "./auth.routes";
import { BusinessRequest } from "../Types/BusinessTypes";
import { changeNotification, createBusiness, editBusiness, getBusinessData } from "../controllers/Business/business.controller";

const businessRouter = Router()

const CreateBusinessRouter: RequestHandler<
{},
{},
BusinessRequest,
{}
> = async (req, res, next) => {
    const { manager_id } = (req as any).manager_data
    if(!manager_id){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }
    const { 
        business_name,
        business_phone
    } = req.body
    if(!business_name){
        res.status(400).json({msg:"El nombre del negocio es obligatorio."})
        return
    }

    if(!business_phone){
        res.status(400).json({msg:"El negocio debe tener un contácto."})
        return
    }

    next()
}

const GetAllBusinesessRouter: RequestHandler = async (req, res, next): Promise<void> => {
    const { manager_id } = (req as any).manager_data
    if(!manager_id){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }
    next()
}

const EditBusinessRouter: RequestHandler<
{},{},
BusinessRequest
,{
    business_id:string
}
> = async (req, res, next) => {
    const { 
        business_name, business_phone
    } = req.body
    const { business_id } = req.query
    
    if(!business_id){
        res.status(400).json({msg:"El negocio es obligatorio."})
        return
    }

    if(!business_name){
        res.status(400).json({msg:"El nombre del negocio es obligatorio."})
        return
    }

    if(!business_phone){
        res.status(400).json({msg:"El negocio debe tener un contácto."})
        return
    }
    next()
}

const ChangeNotificationRouter: RequestHandler<
{},{},{},{
    business_id: string,
    option: "email" | "whatsapp" | "both"
}
> = async (req, res, next): Promise<void> => {
    const {
        business_id, option
    } = req.query

    if(!business_id || !option){
        res.status(400).json({msg:"El servidor no recibió algunos de los parámetros obligatorios."})
        return
    }
    next()
}

businessRouter.post("/create-business", ValidateSessionRouter, CreateBusinessRouter, createBusiness)
businessRouter.get("/get-business", ValidateSessionRouter, GetAllBusinesessRouter, getBusinessData)
businessRouter.put("/edit-business", ValidateSessionRouter, EditBusinessRouter, editBusiness)
businessRouter.put("/change-notification-option", ValidateSessionRouter, ChangeNotificationRouter, changeNotification)

export default businessRouter