import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { ClientsRequest } from "../Types/ClientsTypes";
import { GetAllClients, getClientData, saveClient } from "../controllers/Clients/clients.controller";
import validator from "validator"
const clientRouter = Router()

const SaveClientRouter: RequestHandler<{}, {}, ClientsRequest, {editing_client?: string, client_id?: string}> = async (req, res, next): Promise<void> => {
    const { client_name, client_dni, client_email } = req.body;
    const {editing_client} = req.query
    if (!client_name) {
        res.status(400).json({ msg: 'El nombre del cliente es Obligatorio' });
        return;
    }

    if(client_name.trim().length === 0 || client_name.trim().length < 4) {
        res.status(400).json({ msg: 'El nombre ingresado no es válido, asegurece de no dejarlo en blanco y que contenga almenos 4 caracteres.' });
        return
    }

    if (client_email &&!validator.isEmail(client_email)) {
        res.status(400).json({ msg: 'El correo ingresado no es válido.' });
        return;
    }

    const verifyDNI = (): boolean => {
        if (!client_dni) return true
        //remover puntos y espacios
        const cleanedDNI = String(client_dni).replace(/\./g, '').replace(/\s/g, '')
        if (cleanedDNI.length === 0) {
            return false;
        }
        if (!/^\d+$/.test(cleanedDNI)) {
            return false
        }

        if (cleanedDNI.length < 8 || cleanedDNI.length > 9) {
            return false
        }
        return true
    }
    if (verifyDNI() === false) {
        res.status(400).json({ msg: 'El DNI ingresado no es valido.' });
        return;
    }

    const parsedBoolean = editing_client === "true" ? true : false
    if(parsedBoolean){
        if(!req.query.client_id){
            res.status(400).json({msg:"El ID del cliente es obligatorio."})
            return
        }
    }
    next();
}

const GetAllClientsRouter: RequestHandler = async (req, res, next): Promise<void> => {
    console.log((req as any).manager_data)
    if(!(req as any).manager_data){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }
    next()
}

const GetClientDataRouter: RequestHandler<{},{},{},{client_id:string}> = async (req, res, next): Promise<void> => {
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
clientRouter.post("/save-client", ValidateSessionRouter, SaveClientRouter, saveClient)
clientRouter.get("/get-all-clients", ValidateSessionRouter, GetAllClientsRouter, GetAllClients)
clientRouter.get("/get-client-data", ValidateSessionRouter, GetClientDataRouter, getClientData)

export default clientRouter