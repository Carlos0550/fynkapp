import { pool } from "../../database";
import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import dayjs from "dayjs";
import { AuthenticatedRequest } from "../../AuthenticatedRequest/AuthenticatedRequest";
import { ExpirationClient } from "./Types/ExpirationTypes";

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

export async function getExpirations(req:Request, res: Response) {
    const { "getExpirations.sql": GEQueries } = queries;
    const { user_id } = req as AuthenticatedRequest;

    if (!GEQueries) {
        res.status(404).json({
            message: "No se encontraron queries para la seccion de expiraciones"
        });
        return;
    }

    let client;
    try {
        client = await pool.connect();
        const response = await client.query(GEQueries[0], [
            user_id
        ])

        if (response.rowCount === 0) {
            res.status(404).json({
                message: "No se encontraron vencimientos"
            });
            return;
        }
        const toOvercome = response.rows.filter((item: ExpirationClient) => item.exp_type === "toOvercome");
        const expired = response.rows.filter((item: ExpirationClient) => item.exp_type === "expired");

        res.status(200).json({
            toOvercome,
            expired
        })
        return 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        });
        return
    } finally {
        if (client) {
            client.release();
        }
    }
}