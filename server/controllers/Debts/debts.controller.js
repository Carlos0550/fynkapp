const { pool } = require("../../database.js")
const fs = require("fs").promises
const path = require("path")
const crypto = require("crypto");
const dayjs = require("dayjs");
let queries = {};

(async () => {
    try {
        const files = await fs.readdir(path.join(__dirname, "./Queries"))
        const sqlFiles = files.filter(file => file.endsWith(".sql"))

        await Promise.all(sqlFiles.map(async (file) => {
            const file_path = path.join(__dirname, "./Queries", file)
            const content = await fs.readFile(file_path, "utf-8")

            const queriesArray = content.split(";")
                .map(query => query.trim())
                .filter(query => query.length > 0)

            queries[file] = queriesArray
        }));
        console.log("✅ Archivos SQL de Deudas cargados exitosamente");

    } catch (error) {
        console.error("❌ Error cargando archivos SQL de deudas:", error);
        process.exit(1);
    }
})()

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

async function createDebt(req, res) {
    const { "createDebt.sql": dtqueries } = queries

    if (!dtqueries) {
        console.log("Arhciov SQL createDebt NO ENCONTRADO")
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    }

    const { debt_date, debt_products, client_id } = req.body
    const user_id = req.user_id
    let client;

    try {
        client = await pool.connect()
        const response = await client.query(dtqueries[0], [client_id, debt_products, debt_date, user_id])
        if (response.rowCount === 0) return res.status(400).json({ msg: "No se pudo crear la deuda" })
        return res.status(200).json({ msg: "Deuda creada exitosamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    } finally {
        if (client) await client.release()
    }
}

async function editDebt(req, res) {
    const { "editDebt.sql": etqueries } = queries;

    if (!etqueries) {
        console.log("Archivo SQL editDebt NO ENCONTRADO");
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente",
        });
    }

    const { debt_date, debt_products } = req.body;
    const { debtID } = req.query;
    let client;
    try {
        client = await pool.connect();
        const response = await client.query(etqueries[0], [
            debt_products,
            debt_date,
            debtID,
        ]);
        console.log(response)
        if (response.rowCount === 0) {
            return res.status(400).json({ msg: "No se pudo editar la deuda" });
        }
        return res.status(200).json({ msg: "Deuda editada exitosamente" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente",
        });
    } finally {
        if (client) await client.release()
    }
}

async function deleteDebt(req, res) {
    const { debtID } = req.query
    const { "deleteDebt.sql": dtqueries } = queries

    if (!dtqueries) {
        console.log("Arhciov SQL deleteDebt NO ENCONTRADO")
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    }

    let client;

    try {
        client = await pool.connect()
        const response = await client.query(dtqueries[0], [debtID])
        if (response.rowCount === 0) return res.status(400).json({ msg: "No se pudo eliminar la deuda" })
        return res.status(200).json({ msg: "Deuda eliminada exitosamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    } finally {
        if (client) await client.release()
    }
}

async function findClientsForDebts(req, res) {
    const { "findClientsForDebts.sql": clientQueries } = queries;
    const { search } = req.query
    const user_id = req.user_id
    let client;
    try {
        client = await pool.connect();
        if (search !== "") {
            const dniRegex = /^\d{8,9}$/;
            if (dniRegex.test(search)) {
                const encryptDniForSearch = encrypt(search);
                const result = await client.query(clientQueries[1], [user_id, encryptDniForSearch]);
                if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron clientes con ese DNI." })
                const decriptedDni = decrypt(result.rows[0].client_dni);

                const client_result = {
                    client_id: result.rows[0].client_id,
                    client_fullname: result.rows[0].client_fullname,
                    client_dni: decriptedDni,
                    debt_amount: result.rows[0].debt_amount,
                    debt_status: result.rows[0].debt_status
                }

                return res.status(200).json({
                    client_result: [client_result]
                })
            } else {
                const result = await client.query(clientQueries[0], [user_id, `%${search.toLowerCase()}%`]);
                if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron clientes con ese nombre." })
                const client_result = result.rows.map(client => {
                    const decryptedDni = decrypt(client.client_dni);
                    return {
                        client_id: client.client_id,
                        client_fullname: client.client_fullname,
                        client_dni: decryptedDni,
                        debt_amount: client.debt_amount,
                        debt_status: client.debt_status
                    }
                })
                return res.status(200).json({
                    client_result
                })
            }
        } else {
            const result = await client.query(clientQueries[2], [user_id]);
            if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron clientes." })
            const client_result = result.rows.map(client => {
                const decryptedDni = decrypt(client.client_dni);
                return {
                    client_id: client.client_id,
                    client_fullname: client.client_fullname,
                    client_dni: decryptedDni,
                    debt_amount: client.debt_amount,
                    debt_status: client.debt_status
                }
            })
            return res.status(200).json({
                client_result
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
        })
    } finally {
        if (client) client.release();
    }
}

async function cancelDebt(req, res) {
    const { "cancelDebt.sql": cdqueries } = queries
    const { clientID } = req.query
    const user_id = req.user_id
    let client;
    try {
        client = await pool.connect()   
        await client.query("BEGIN");
        const result1 = await client.query(cdqueries[0], [user_id,clientID])
        if (result1.rowCount === 0){
            await client.query("ROLLBACK");
            throw new Error("Hubo un error inesperado al cancelar la deuda.")
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
            ])
        }

        await client.query(cdqueries[2], [clientID])
        await client.query(cdqueries[3], [clientID])
        await client.query("COMMIT");
        return res.status(200).json({ msg: "Deuda cancelada exitosamente" })
    } catch (error) {
        console.log(error)
        await client.query("ROLLBACK");
        return res.status(500).json({
            msg: error.message || "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
        })
    } finally {
        if (client) client.release();
    }
}

module.exports = {
    createDebt, editDebt, deleteDebt, findClientsForDebts, cancelDebt
};