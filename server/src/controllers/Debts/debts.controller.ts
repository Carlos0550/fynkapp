// src/controllers/debtController.ts
import { Request, Response } from "express";
import { pool } from "../../database";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import dayjs from "dayjs";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV || "", "hex");

function encrypt(text: string): string {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

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

async function createDebt(req: Request, res: Response): Promise<Response> {
    const { "createDebt.sql": dtqueries } = queries;
    const { debt_date, debt_products, client_id } = req.body;
    const user_id = (req as any).user_id;
    let client;

    if (!dtqueries) {
        return res.status(500).json({ msg: "Error interno en el servidor." });
    }

    try {
        client = await pool.connect();
        const response = await client.query(dtqueries[0], [client_id, debt_products, debt_date, user_id]);
        if (response.rowCount === 0) return res.status(400).json({ msg: "No se pudo crear la deuda" });
        return res.status(200).json({ msg: "Deuda creada exitosamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error interno en el servidor" });
    } finally {
        if (client) client.release();
    }
}

async function editDebt(req: Request, res: Response): Promise<Response> {
    const { "editDebt.sql": etqueries } = queries;
    const { debt_date, debt_products } = req.body;
    const { debtID } = req.query as { debtID: string };
    let client;

    if (!etqueries) {
        return res.status(500).json({ msg: "Error interno en el servidor." });
    }

    try {
        client = await pool.connect();
        const response = await client.query(etqueries[0], [debt_products, debt_date, debtID]);
        if (response.rowCount === 0) return res.status(400).json({ msg: "No se pudo editar la deuda" });
        return res.status(200).json({ msg: "Deuda editada exitosamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error interno en el servidor" });
    } finally {
        if (client) client.release();
    }
}

async function deleteDebt(req: Request, res: Response): Promise<Response> {
    const { debtID } = req.query as { debtID: string };
    const { "deleteDebt.sql": dtqueries } = queries;
    let client;

    if (!dtqueries) {
        return res.status(500).json({ msg: "Error interno en el servidor." });
    }

    try {
        client = await pool.connect();
        const response = await client.query(dtqueries[0], [debtID]);
        if (response.rowCount === 0) return res.status(400).json({ msg: "No se pudo eliminar la deuda" });
        return res.status(200).json({ msg: "Deuda eliminada exitosamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error interno en el servidor" });
    } finally {
        if (client) client.release();
    }
}

async function findClientsForDebts(req: Request, res: Response): Promise<Response> {
    const { "findClientsForDebts.sql": clientQueries } = queries;
    const { search } = req.query as { search: string };
    const user_id = (req as any).user_id;
    let client;

    try {
        client = await pool.connect();
        if (search !== "") {
            const dniRegex = /^\d{8,9}$/;
            if (dniRegex.test(search)) {
                const encryptDniForSearch = encrypt(search);
                const result = await client.query(clientQueries[1], [user_id, encryptDniForSearch]);
                if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron clientes con ese DNI." });
                const decryptedDni = decrypt(result.rows[0].client_dni);
                return res.status(200).json({
                    client_result: [{
                        client_id: result.rows[0].client_id,
                        client_fullname: result.rows[0].client_fullname,
                        client_dni: decryptedDni,
                        debt_amount: result.rows[0].debt_amount,
                        debt_status: result.rows[0].debt_status
                    }]
                });
            } else {
                const result = await client.query(clientQueries[0], [user_id, `%${search.toLowerCase()}%`]);
                if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron clientes con ese nombre." });
                const client_result = result.rows.map(c => ({
                    client_id: c.client_id,
                    client_fullname: c.client_fullname,
                    client_dni: c.client_dni ? decrypt(c.client_dni) : c.client_dni,
                    debt_amount: c.debt_amount,
                    debt_status: c.debt_status
                }));
                return res.status(200).json({ client_result });
            }
        } else {
            const result = await client.query(clientQueries[2], [user_id]);
            if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron clientes." });
            const client_result = result.rows.map(c => ({
                client_id: c.client_id,
                client_fullname: c.client_fullname,
                client_dni: c.client_dni ? decrypt(c.client_dni) : c.client_dni,
                debt_amount: c.debt_amount,
                debt_status: c.debt_status
            }));
            return res.status(200).json({ client_result });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    } finally {
        if (client) client.release();
    }
}

async function cancelDebt(req: Request, res: Response): Promise<Response> {
    const { "cancelDebt.sql": cdqueries } = queries;
    const { clientID } = req.query as { clientID: string };
    const user_id = (req as any).user_id;
    let client;

    try {
        client = await pool.connect();
        await client.query("BEGIN");
        const result1 = await client.query(cdqueries[0], [user_id, clientID]);

        if (result1.rowCount === 0 ||
            result1.rows[0].debt_details.length === 0 ||
            result1.rows[0].deliver_details.length === 0) {
            await client.query("ROLLBACK");
            throw new Error("No se puede cancelar la deuda: datos insuficientes");
        }

        const totalDebt = result1.rows.reduce((acc, item) => acc + parseFloat(item.total_debt_amount ?? 0), 0);
        const totalDelivers = parseFloat(result1.rows[0]?.total_delivers_amount ?? 0);
        const settledAccount = totalDebt - totalDelivers;

        if (settledAccount !== 0) {
            await client.query("ROLLBACK");
            throw new Error("El cliente aún tiene un saldo pendiente, no es posible cancelar.");
        }

        for (const history of result1.rows) {
            await client.query(cdqueries[1], [
                history.client_id,
                JSON.stringify(history.debt_details),
                JSON.stringify(history.deliver_details),
                history.total_debt_amount,
                history.total_delivers_amount,
                dayjs(history.debt_date).format("YYYY-MM-DD"),
                user_id
            ]);
        }

        await client.query(cdqueries[2], [clientID]);
        await client.query(cdqueries[3], [clientID]);
        await client.query("COMMIT");
        return res.status(200).json({ msg: "Deuda cancelada exitosamente" });
    } catch (error: any) {
        console.log(error);
        if (client) await client.query("ROLLBACK");
        return res.status(500).json({ msg: error.message || "Error interno del servidor" });
    } finally {
        if (client) client.release();
    }
}

async function getHistoryRegistry(req: Request, res: Response): Promise<Response> {
    const { "getHistoryClient.sql": ghqueries } = queries;
    const { clientID } = req.query as { clientID: string };
    const user_id = (req as any).user_id;
    let client;

    if (!clientID || !ghqueries) {
        return res.status(400).json({ msg: "Debe proporcionar un ID de cliente" });
    }

    try {
        client = await pool.connect();
        const response = await client.query(ghqueries[0], [clientID, user_id]);
        if (response.rowCount === 0) return res.status(404).json({ msg: "No se encontraron historiales." });
        return res.status(200).json({ history: response.rows });
    } catch (error) {
        console.log("❌ Error en getHistoryRegistry:", error);
        return res.status(500).json({ msg: "Error interno en el servidor" });
    } finally {
        if (client) client.release();
    }
}

async function getHistoryClient(req: Request, res: Response): Promise<Response> {
    const { "getHistoryClient.sql": ghqueries } = queries;
    const { clientID, history_id } = req.query as { clientID: string, history_id: string };
    const user_id = (req as any).user_id;
    let client;

    if (!ghqueries) {
        return res.status(500).json({ msg: "Archivo SQL no encontrado." });
    }

    try {
        client = await pool.connect();
        const response = await client.query(ghqueries[1], [clientID, user_id, history_id]);
        if (response.rowCount === 0) return res.status(404).json({ msg: "No se encontraron historiales" });

        const clientHistory = response.rows.reduce((acc: any, history) => {
            const debtDate = history.debt_date;
            if (!acc[debtDate]) {
                acc[debtDate] = {
                    debt_date: debtDate,
                    total_debts: parseFloat(history.total_debts) || 0,
                    debt_details: [],
                    deliver_details: [],
                    created_at: history.created_at
                };
            }
            if (history.debt_detail && !acc[debtDate].debt_details.some((i: any) => JSON.stringify(i) === JSON.stringify(history.debt_detail))) {
                acc[debtDate].debt_details.push(history.debt_detail);
            }
            if (history.deliver_detail && !acc[debtDate].deliver_details.some((i: any) => JSON.stringify(i) === JSON.stringify(history.deliver_detail))) {
                acc[debtDate].deliver_details.push(history.deliver_detail);
            }
            return acc;
        }, {});

        const formattedHistory = Object.values(clientHistory);
        return res.status(200).json({ history: formattedHistory });
    } catch (error) {
        console.log("❌ Error en getHistoryClient:", error);
        return res.status(500).json({ msg: "Error interno en el servidor" });
    } finally {
        if (client) client.release();
    }
}

export {
    createDebt,
    editDebt,
    deleteDebt,
    findClientsForDebts,
    cancelDebt,
    getHistoryRegistry,
    getHistoryClient
};
