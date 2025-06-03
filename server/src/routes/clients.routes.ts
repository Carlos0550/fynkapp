import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { ClientsRequest } from "../Types/ClientsTypes";
import { GetAllClients, getClientData, saveClient } from "../controllers/Clients/clients.controller";
import validator from "validator"
import pool from "../connections/database_conn";
const clientRouter = Router()

const SaveClientRouter: RequestHandler<{}, {}, ClientsRequest, {editing_client?: string, client_id?: string}> = async (req, res, next): Promise<void> => {
    const { client_name, client_dni, client_email, client_phone } = req.body;
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

    if(!client_phone && !client_email){
        res.status(400).json({ msg: 'El cliente debe poder ser contactado de alguna manera, ingrese un correo o número telefónico' });
        return
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

const DeleteClientRouter: RequestHandler<{},{},{},{client_id:string}> = async (req, res, next): Promise<void> => {
    if(!(req as any).manager_data){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }
    const { client_id } = req.query
    if(!client_id){
        res.status(400).json({msg:"El ID del cliente es obligatorio."})
        return
    }
    
    try {
        const result = await pool.query("DELETE FROM clients WHERE client_id = $1 AND manager_client_id = $2", [client_id, (req as any).manager_data.manager_id])
        if(result.rowCount! > 0){
            res.status(200).json({msg:"El cliente ha sido eliminado."})
            return
        }else{
            res.status(400).json({msg:"El cliente no pudo ser eliminado."})
            return
        }
    } catch (error) {
        console.error("❌ Error al eliminar el cliente:", error);
        res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente." });
        return;
    }
}
clientRouter.post("/save-client", ValidateSessionRouter, SaveClientRouter, saveClient)
clientRouter.get("/get-all-clients", ValidateSessionRouter, GetAllClientsRouter, GetAllClients)
clientRouter.get("/get-client-data", ValidateSessionRouter, GetClientDataRouter, getClientData)
clientRouter.delete("/delete-client", ValidateSessionRouter, DeleteClientRouter)

export default clientRouter