import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { ClientsRequest } from "../Types/ClientsTypes";
import { GetAllClients, saveClient } from "../controllers/Clients/clients.controller";
import validator from "validator"
const clientRouter = Router()

const SaveClientRouter: RequestHandler<{}, {}, ClientsRequest, {}> = async (req, res, next): Promise<void> => {
    const { client_name, client_dni, client_email, client_address } = req.body;
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

clientRouter.post("/save-client", ValidateSessionRouter, SaveClientRouter, saveClient)
clientRouter.get("/get-all-clients", ValidateSessionRouter, GetAllClientsRouter, GetAllClients)

export default clientRouter