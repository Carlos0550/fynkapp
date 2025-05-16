import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { ClientsRequest } from "../Types/ClientsTypes";
import { saveClient } from "../controllers/Clients/clients.controller";
import validator from "validator"
const clientRouter = Router()

const SaveClientRouter: RequestHandler<{}, {}, ClientsRequest, {}> = async (req, res, next): Promise<void> => {
    const { client_name, client_dni, client_email, client_address } = req.body;
    if (!client_name || !client_dni || !client_email || !client_address) {
        res.status(400).json({ msg: 'Todos los campos son obligatorios, revise los que está con "*"' });
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

        if (cleanedDNI.length < 5 || cleanedDNI.length > 10) {
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

clientRouter.post("/save-client", ValidateSessionRouter, SaveClientRouter, saveClient)

export default clientRouter