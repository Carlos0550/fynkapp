import { RequestHandler, Router } from "express";

import { ValidateSessionRouter } from "./auth.routes";
import { DeliverRequest } from "../Types/DeliversTypes";
import pool from "../connections/database_conn";

import { saveDeliver } from "../controllers/Delivers/delivers.controller";

const deliverRouter = Router()
const SaveDeliverRouter: RequestHandler<{}, {}, DeliverRequest, { client_id: string }> = async (
    req, res, next
): Promise<void> => {
    const { manager_id } = (req as any).manager_data;
    const { client_id } = req.query;
    const { deliver_amount, deliver_date, deliver_details } = req.body

    try {
        if (!manager_id) {
            res.status(401).json({ msg: "Acceso no autorizado." })
            return
        }
        if (!client_id) {
            res.status(400).json({ msg: "El ID del cliente es obligatorio." })
            return
        }
        if (!deliver_amount) {
            res.status(400).json({ msg: "El monto es obligatorio." })
            return
        }

        const CQ = `
            SELECT 
                c.client_id,
                c.client_name,
                c.client_aditional_data,
                COALESCE(SUM(d.debt_total),0) AS total_debts
            FROM clients c
            LEFT JOIN debts d ON d.client_debt_id = c.client_id
            WHERE c.client_id = $1 AND c.manager_client_id = $2
            GROUP BY c.client_id, c.client_name, c.client_aditional_data;
        `
        const queryTotal = await pool.query(CQ, [client_id, manager_id])
        console.log(queryTotal.rows[0])
        const totalDebtsClient = queryTotal.rows[0].total_debts

        if (parseFloat(totalDebtsClient) <= parseFloat(deliver_amount)) {
            res.status(417).json({ msg: "El monto ingresado es mayor a la deuda del cliente.", totalDebtsClient })
            return
        }
        if (!deliver_date) {
            res.status(400).json({ msg: "La fecha es obligatoria." })
            return
        }

        next()
    } catch (error) {
        console.error("Error en la verificación de guardado de entregas:", error);
        res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." })
        return
    }
}

deliverRouter.post("/save-deliver", ValidateSessionRouter, SaveDeliverRouter, saveDeliver)

export default deliverRouter