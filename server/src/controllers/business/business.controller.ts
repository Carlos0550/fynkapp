import { pool } from "../../database";
import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { AuthenticatedRequest } from "../../AuthenticatedRequest/AuthenticatedRequest";

let queries: Record<string, string[]> = {};

(async () => {
    try {
        const files = await fs.readdir(path.join(__dirname, "./Queries"));
        const sqlFiles = files.filter(file => file.endsWith(".sql"))

        await Promise.all(sqlFiles.map(async (file) => {
            const filePath = path.join(__dirname, "./Queries", file)
            const content = await fs.readFile(filePath, "utf-8")

            const queriesArray = content
                .split(";")
                .map(query => query.trim())
                .filter(q => q.length > 0)

            queries[file] = queriesArray
        }))
    } catch (error) {
        console.error("Error cargando archivos SQL en la sección de negocios:", error);
    }
})()

export async function saveBusiness(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest<{}, {}, { business_name: string }, {}>;
    const { business_name } = authReq.body;
    const user_id = authReq.user_id;
    const { "saveBusiness.sql": SBQueries } = queries;

    if (!SBQueries) {
        res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente."
        })
        console.log("Error cargando el archivo saveBusiness.sql")
        return;
    }

    let client;

    try {
        client = await pool.connect()

        const result = await client.query(SBQueries[0], [
            business_name,
            user_id
        ])

        if (result.rowCount === 0) {
            res.status(400).json({
                msg: "No fué posible guardar el nuevo negocio, for favor intente nuevamente."
            })

            return;
        };

        res.status(200).json({
            msg: "Negocio creado exitosamente."
        })

        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente."
        })
        return;
    } finally {
        if (client) client.release()
    }
}
