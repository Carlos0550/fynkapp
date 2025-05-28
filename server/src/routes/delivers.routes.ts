import { RequestHandler, Router } from "express";

import { ValidateSessionRouter } from "./auth.routes";
import { DeliverRequest } from "../Types/DeliversTypes";
import pool from "../connections/database_conn";

import { saveDeliver } from "../controllers/Delivers/delivers.controller";

const deliverRouter = Router()
const SaveDeliverRouter: RequestHandler<
  {},
  {},
  DeliverRequest,
  {
    client_id: string;
    isEditing?: string;
    deliver_id?: string;
  }
> = async (req, res, next): Promise<void> => {
  const { manager_id } = (req as any).manager_data;
  const { client_id, isEditing, deliver_id } = req.query;
  const { deliver_amount, deliver_date } = req.body;

  try {
    if (!manager_id) {
      res.status(401).json({ msg: "Acceso no autorizado." });
      return;
    }
    if (!client_id) {
      res.status(400).json({ msg: "El ID del cliente es obligatorio." });
      return;
    }
    if (!deliver_amount) {
      res.status(400).json({ msg: "El monto es obligatorio." });
      return;
    }

    const isEdit = isEditing === "true";

    if (isEdit && !deliver_id) {
      res.status(400).json({ msg: "El ID de la entrega es obligatorio." });
      return;
    }

    if (!isEdit && !deliver_date) {
      res.status(400).json({ msg: "La fecha es obligatoria." });
      return;
    }

    const CQ = isEdit
      ? `
        SELECT 
          c.client_id,
          c.client_name,
          c.client_aditional_data,
          COALESCE(SUM(d.debt_total),0) AS total_debts,
          COALESCE(SUM(ds.deliver_amount),0) AS total_delivers
        FROM clients c
        LEFT JOIN debts d ON d.client_debt_id = c.client_id
        LEFT JOIN delivers ds ON ds.client_deliver_id = c.client_id
        WHERE c.client_id = $1 AND c.manager_client_id = $2 AND d.estado_financiero = 'activo' 
        GROUP BY c.client_id, c.client_name, c.client_aditional_data;
      `
      : `
        SELECT 
          c.client_id,
          c.client_name,
          c.client_aditional_data,
          COALESCE(SUM(d.debt_total),0) AS total_debts
        FROM clients c
        LEFT JOIN debts d ON d.client_debt_id = c.client_id
        WHERE c.client_id = $1 AND c.manager_client_id = $2 AND d.estado_financiero = 'activo'
        GROUP BY c.client_id, c.client_name, c.client_aditional_data;
      `;

    const queryTotal = await pool.query(CQ, [client_id, manager_id]);

    if (!queryTotal.rowCount || queryTotal.rowCount === 0) {
      res.status(400).json({ msg: "El cliente no tiene deudas activas." });
      return;
    }

    const totalDebtsClient = queryTotal.rows[0].total_debts;
    const totalDeliversClient = queryTotal.rows[0].total_delivers;
    const deuda = Number(totalDebtsClient);
    const pago = Number(deliver_amount);

    if (!isEdit && (pago > deuda || deuda === 0)) {
      res.status(417).json({
        msg: "El monto ingresado es mayor a la deuda del cliente.",
        totalDebtsClient,
      });
      return;
    }

    if (isEdit) {
      const calc = Number(totalDeliversClient) + Number(deliver_amount);
      if (calc > deuda) {
        res.status(417).json({
          msg: "El monto ingresado es mayor a la deuda del cliente.",
          totalDebtsClient: deuda - Number(totalDeliversClient),
        });
        return;
      }
    }

    next(); 
  } catch (error) {
    console.error("Error en la verificación de guardado de entregas:", error);
    res.status(500).json({
      msg: "Error interno del servidor, espere unos segundos e intente nuevamente.",
    });
  }
};


deliverRouter.post("/save-deliver", ValidateSessionRouter, SaveDeliverRouter, saveDeliver)

export default deliverRouter