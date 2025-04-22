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


const PERMISSIONS_BY_ROLE = {
  level1: ["beginner_dashboard", "fast_actions"],
  level2: ["fast_actions", "clients", "debts", "beginner_dashboard"],
  level3: ["fast_actions", "clients", "debts", "expirations", "admin_dashboard", "admin_dashboard"],
};

const getPermissionesByRole = (role: "level1" | "level2" | "level3" | "custom"): string[] => {
  if(!role) return [];
  if(role === "custom") return [];
  return PERMISSIONS_BY_ROLE[role];
}


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
    employee_role,
    employee_permissions,
    business_name
  } = req.query;
  const user_id = (req as any).user_id;

  

  return res.status(200).json({ message: "Controlador operativo. Falta implementar la lógica de guardado." });
}

export {
  saveEmployeer
};