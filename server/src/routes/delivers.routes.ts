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
    business_id: string;
  }
> = async (req, res, next): Promise<void> => {
  const { manager_id } = (req as any).manager_data;
  const { client_id, isEditing, deliver_id, business_id } = req.query;
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

    const CQ = `SELECT * FROM delivers WHERE client_deliver_id = $1 AND manager_client_id = $2 AND business_deliver_id = $3 AND estado_financiero = 'activo'`;
    const CQ1 =  `SELECT * FROM debts WHERE client_debt_id = $1 AND manager_client_id = $2 AND business_debt_id = $3 AND estado_financiero = 'activo'`;
    const queryTotal = await Promise.all([
      pool.query(CQ, [client_id, manager_id, business_id]),
      pool.query(CQ1, [client_id, manager_id, business_id]),
    ])
    
    if (queryTotal[1].rowCount === 0) {
      res.status(400).json({ msg: "El cliente no tiene deudas activas." });
      return;
    }
    

    const deudas = queryTotal[1].rows.reduce((acc, curr) => acc + Number(curr.debt_total), 0);
    const entregas = queryTotal[0].rows.reduce((acc, curr) => acc + Number(curr.deliver_amount), 0);
    const totalAccount = Number(deudas) - Number(entregas);
    
    if (Number(deliver_amount) > totalAccount || totalAccount === 0) {
      res.status(417).json({
        msg: "El monto ingresado es mayor a la deuda del cliente.",
        totalDebtsClient: totalAccount,
      });
      return;
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