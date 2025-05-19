import pool from "../../connections/database_conn";
import { RequestHandler } from "express";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import { DeliverRequest } from "../../Types/DeliversTypes";
import { generateRandomKey } from "../../Security/EncryptationModule";
import dayjs from "dayjs";

const queries = getQueries(path.join(__dirname, "./Queries"));

export const saveDeliver: RequestHandler<{}, {}, DeliverRequest, { client_id: string }> = async (req, res): Promise<void> => {
  const { manager_id } = (req as any).manager_data;
  const { client_id } = req.query;
  const { deliver_amount, deliver_date, deliver_details } = req.body;

  const SD = queries["saveDeliver.sql"];

  try {
    await pool.query("BEGIN");
    const deliverID = generateRandomKey(16);

    const result = await pool.query(SD[0], [
      deliverID,
      deliver_amount,
      deliver_date,
      manager_id,
      client_id,
      deliver_details || null
    ]);

    if (result.rowCount! > 0) {
      const allExpDates = await pool.query(SD[1], [client_id, manager_id]);

      if (allExpDates.rowCount! > 0) {
        const today = dayjs().startOf("day");
        const newExpDate = today.add(1, "month").startOf("day").format("YYYY-MM-DD HH:mm:ss");
        let shouldUpdate = false;

        for (const row of allExpDates.rows) {
          const exp = dayjs(row.exp_date).startOf("day");
          console.log("exp", exp.format("YYYY-MM-DD HH:mm:ss"))
          console.log("Today: ", today.format("YYYY-MM-DD HH:mm:ss"))
          console.log(exp.isSame(today) || exp.isBefore(today))
          if (exp.isSame(today) || exp.isBefore(today)) {
            shouldUpdate = true;
            break;
          }
        }

        if (shouldUpdate) {
          const result = await pool.query(
            SD[2],
            [newExpDate, client_id, manager_id, dayjs(today).format("YYYY-MM-DD HH:mm:ss")]
          );
          if(result.rowCount! === 0) throw new Error("Error al actualizar las fechas vencidas del cliente") 
          console.log(`🟢 Se actualizaron las fechas vencidas del cliente ${client_id}`);
        } else {
          console.log("📌 No hay deudas vencidas ni con fecha de hoy. No se actualiza nada.");
        }
      }
        await pool.query("COMMIT");

      res.status(200).json({ msg: "Entrega creada con éxito" });
    } else {
      throw new Error("Error interno del servidor, espere unos segundos e intente nuevamente.")
    }
  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.error("❌ Error al guardar la entrega:", error);
    res.status(500).json({ msg: error.message || "Error interno del servidor, espere unos segundos e intente nuevamente." });
  }
};
