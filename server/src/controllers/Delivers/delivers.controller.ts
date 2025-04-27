// src/controllers/deliverController.ts
import { Request, Response } from "express";
import { pool } from "../../database";
import fs from "fs/promises";
import path from "path";
import dayjs from "dayjs";

let queries: Record<string, string[]> = {};

(async () => {
  try {
    const files = await fs.readdir(path.join(__dirname, "./Queries"));
    const sqlFiles = files.filter(file => file.endsWith(".sql"));

    await Promise.all(sqlFiles.map(async (file) => {
      const file_path = path.join(__dirname, "./Queries", file);
      const content = await fs.readFile(file_path, "utf-8");
      const queriesArray = content
        .split(";")
        .map(query => query.trim())
        .filter(query => query.length > 0);
      queries[file] = queriesArray;
    }));
    console.log("✅ Archivos SQL de Deudas cargados exitosamente");
  } catch (error) {
    console.error("❌ Error cargando archivos SQL de deudas:", error);
    process.exit(1);
  }
})();

async function createDeliver(req: Request, res: Response) {
  const { "createDeliver.sql": dsqueries } = queries;

  if (!dsqueries) {
    console.log("Archivo SQL createDeliver NO ENCONTRADO");
    res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente" });
    return
  }

  const { deliver_date, deliver_amount, deliver_client_id } = req.body;
  const user_id = (req as any).user_id;
  let client;

  try {
    client = await pool.connect();
    const response = await client.query(dsqueries[0], [
      Number(deliver_amount),
      dayjs(deliver_date).format("YYYY-MM-DD"),
      deliver_client_id,
      user_id
    ]);

    if (response.rowCount === 0) {
      res.status(400).json({ msg: "No se pudo crear la entrega" });
      return
    }

    const nextWeek = dayjs().add(1, "month").format("YYYY-MM-DD");
    await client.query(dsqueries[1], [nextWeek, deliver_client_id, user_id]);
    res.status(200).json({ msg: "Entrega creada exitosamente" });
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente" });
    return
  } finally {
    if (client) await client.release();
  }
}

async function editDeliver(req: Request, res: Response) {
  const { "editDeliver.sql": dsqueries } = queries;

  if (!dsqueries) {
    console.log("Archivo SQL editDeliver NO ENCONTRADO");
    res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente" });
    return
  }

  const { deliver_amount, deliver_date, deliver_id } = req.body;
  let client;

  try {
    client = await pool.connect();
    const response = await client.query(dsqueries[0], [
      Number(deliver_amount),
      dayjs(deliver_date).format("YYYY-MM-DD"),
      deliver_id
    ]);

    if (response.rowCount === 0) {
      res.status(400).json({ msg: "No se pudo editar la entrega" });
      return
    }
    res.status(200).json({ msg: "Entrega editada exitosamente" });
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente" });
    return
  } finally {
    if (client) await client.release();
  }
}

async function deleteDeliver(req: Request, res: Response) {
  const { deliver_id } = req.query as { deliver_id: string };
  let client;

  try {
    client = await pool.connect();
    const response = await client.query(
      "DELETE FROM delivers WHERE deliver_id = $1",
      [deliver_id]
    );

    if (response.rowCount === 0) {
      res.status(400).json({ msg: "No se pudo eliminar la entrega" });
      return
    }
    res.status(200).json({ msg: "Entrega eliminada exitosamente" });
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente" });
    return
  } finally {
    if (client) await client.release();
  }
}

export {
  createDeliver,
  editDeliver,
  deleteDeliver
};