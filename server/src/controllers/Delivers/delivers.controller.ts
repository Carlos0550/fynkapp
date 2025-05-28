import pool from "../../connections/database_conn";
import { RequestHandler } from "express";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import { DeliverRequest } from "../../Types/DeliversTypes";
import { generateRandomKey } from "../../Security/EncryptationModule";
import dayjs from "dayjs";

const queries = getQueries(path.join(__dirname, "./Queries"));

export const saveDeliver: RequestHandler<
  {},
  {},
  DeliverRequest,
  {
    client_id: string,
    isEditing?: string,
    deliver_id?: string
  }
> = async (req, res): Promise<void> => {
  const { manager_id } = (req as any).manager_data;
  const { client_id, isEditing, deliver_id } = req.query;
  const { deliver_amount, deliver_date, deliver_details } = req.body;
  const SD = queries["saveDeliver.sql"];

  try {
    console.log(isEditing)
    if (isEditing === "true") {
      console.log("esta editando una entrega");
      const result =await pool.query(SD[6],[
        deliver_amount,
        deliver_date,
        deliver_details || null,
        deliver_id
      ])

      if(result.rowCount! > 0){
        await pool.query("COMMIT");
        res.status(200).json({ msg: "Entrega editada con exito" });
        return
      }else{
        throw new Error("No se pudo editar la entrega")
      }
    } else {
      console.log("esta creando una entrega");
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

        const newExpDate = dayjs(deliver_date).add(1, "month").format("YYYY-MM-DD HH:mm:ss")

        const updateResult = await pool.query(SD[1], [newExpDate, client_id, manager_id]);

        if (updateResult.rowCount! === 0) {
          throw new Error("No se actualizaron las fechas de vencimiento del cliente");
        }

        console.log(`🟢 Fechas de vencimiento actualizadas a ${newExpDate}`);

        const deudaResult = await pool.query(SD[2], [client_id, manager_id]);

        const entregaResult = await pool.query(SD[3], [client_id, manager_id]);

        const totalDeuda = Number(deudaResult.rows[0].total_deuda);
        const totalEntregas = Number(entregaResult.rows[0].total_entregas);

        if (totalEntregas >= totalDeuda && totalDeuda > 0) {
          const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

          await pool.query(SD[4], [client_id, manager_id, now]);

          await pool.query(SD[5], [client_id, manager_id, now]);

          console.log(`✅ Cliente ${client_id} saldó su deuda. Registros cerrados.`);
        }

        await pool.query("COMMIT");
        res.status(200).json({ msg: "Entrega creada con éxito" });
        return;
      } else {
        throw new Error("Error interno del servidor, espere unos segundos e intente nuevamente.");
      }
    }

  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.error("❌ Error al guardar la entrega:", error);
    res.status(500).json({
      msg: error.message || "Error interno del servidor, espere unos segundos e intente nuevamente."
    });
  }
};

