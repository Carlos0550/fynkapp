// src/Cron_Jobs/cron_jobs.controller.ts
import { pool } from "../../database";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

let queries: Record<string, string[]> = {};

(async () => {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, "./Queries"));
    const sqlFiles = files.filter(file => file.endsWith(".sql"));

    await Promise.all(sqlFiles.map(async (file) => {
      const filePath = path.join(__dirname, "./Queries", file);
      const content = await fs.promises.readFile(filePath, "utf-8");
      const queriesArray = content
        .split(";")
        .map(query => query.trim())
        .filter(query => query.length > 0);

      queries[file] = queriesArray;
    }));

    console.log("✅ Archivos SQL de Cron Jobs cargados exitosamente");
  } catch (error) {
    console.error("❌ Error cargando archivos SQL de cron jobs:", error);
    process.exit(1);
  }
})();

const updateDebtsStatus = async (): Promise<void> => {
  const UDSQueries = queries["update_debts_status.sql"];
  if (!UDSQueries) {
    console.error("❌ No se encontró la consulta SQL para actualizar el estado de las deudas");
    return;
  }

  try {
    const today = dayjs().format("YYYY-MM-DD");
    const result1 = await pool.query(UDSQueries[0], [today]);
    const result2 = await pool.query(UDSQueries[1]);

    console.log(`✅ ${result1.rowCount} deudas actualizadas a 'noactive' exitosamente`);
    console.log(`✅ ${result2.rowCount} deudas actualizadas a 'active' exitosamente`);
  } catch (error) {
    console.error("❌ Error al actualizar el estado de las deudas:", error);
  }
};

export {
  updateDebtsStatus
};
