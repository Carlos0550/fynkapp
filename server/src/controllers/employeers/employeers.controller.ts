// src/controllers/employeerController.ts
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
      const filePath = path.join(__dirname, "./Queries", file);
      const content = await fs.readFile(filePath, "utf-8");
      const queriesArray = content
        .split(";")
        .map(query => query.trim())
        .filter(query => query.length > 0);
      queries[file] = queriesArray;
    }));
  } catch (error) {
    console.error("Error cargando archivos SQL:", error);
  }
})();

async function saveEmployeer(req: Request, res: Response): Promise<Response> {
  const { "saveEmployeer.sql": SEQueries } = queries;

  if (!SEQueries) {
    console.log("Error al cargar el archivo saveEmployeer.sql");
    return res.status(400).json({
      message: "Error interno del servidor, espere unos segundos e intente nuevamente."
    });
  }

  const {
    employeer_name,
    employeer_email,
    employee_role
  } = req.query as Record<string, string>;

  // Aquí se debería implementar la lógica de guardado del empleador.
  // Por ejemplo:
  // try {
  //   const client = await pool.connect();
  //   await client.query(SEQueries[0], [employeer_name, employeer_email, employee_role]);
  //   client.release();
  //   return res.status(200).json({ message: "Empleado guardado exitosamente" });
  // } catch (error) {
  //   console.error("Error al guardar empleado:", error);
  //   return res.status(500).json({ message: "Error interno del servidor" });
  // }

  return res.status(200).json({ message: "Controlador operativo. Falta implementar la lógica de guardado." });
}

export {
  saveEmployeer
};