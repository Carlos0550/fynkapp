const { pool } = require("../../database.js");
const path = require("path");
const fsP = require("fs").promises;
require("dotenv").config();
const crypto = require("crypto");

let queries = {};

(async () => {
    try {
        const files = await fsP.readdir(path.join(__dirname, "./Queries"));
        const sqlFiles = files.filter(file => file.endsWith(".sql"));

        await Promise.all(sqlFiles.map(async (file) => {
            const filePath = path.join(__dirname, "./Queries", file);
            const content = await fsP.readFile(filePath, "utf-8");
            const queriesArray = content
                .split(";")
                .map(query => query.trim())
                .filter(query => query.length > 0);
            queries[file] = queriesArray;
        }));
        console.log("✅ Archivos SQL de clientes cargados exitosamente");
    } catch (error) {
        console.error("❌ Error cargando archivos SQL:", error);
        process.exit(1);
    }
})();

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

async function createClient(req, res) {
    const { "createClient.sql": clientQueries } = queries;
    const user_id = req.user_id

    if (!clientQueries) {
        console.error("❌ Archivo de consultas de 'createClient' no encontrado");
        return res.status(500).json({ msg: "Error interno del servidor. Inténtalo más tarde." });
    }

    let client;
    const { client_fullname, client_dni, client_phone, client_address, client_email, client_city } = req.body;

    try {
        client = await pool.connect();
        await client.query("BEGIN");

        const encryptedDni = encrypt(client_dni);

        const encryptedPhone = encrypt(client_phone);

        const encryptedAddress = encrypt(client_address);

        const result1 = await client.query(clientQueries[0], [encryptedDni, user_id]);

        if (result1.rows[0].count > 0) {
            throw new Error("Ya existe un cliente con ese DNI.");
        }

        const result = await client.query(clientQueries[1], [
            client_fullname, client_email, encryptedPhone, encryptedDni, encryptedAddress, client_city, user_id
        ]);

        if (result.rowCount === 0) {
            throw new Error("Error desconocido al crear el cliente.");
        }

        await client.query("COMMIT");

        return res.status(200).json({ msg: "Cliente creado exitosamente." });

    } catch (error) {
        console.error("Error al crear cliente:", error);
        if (client) await client.query("ROLLBACK");
        return res.status(400).json({ msg: error.message || "Error interno del servidor.", error });
    } finally {
        if (client) client.release();
    }
}

const getClients = async (req, res) => {
    const { "getClients.sql": clientQueries } = queries;

    if (!clientQueries) {
        console.error("❌ Archivo de consultas de 'getClients' no encontrado");
        return res.status(500).json({ msg: "Error interno del servidor. Inténtalo más tarde." });
    }
    const user_id = req.user_id

    let client;
    const { searchQuery } = req.query;
    try {
        client = await pool.connect();
        if (searchQuery !== "") {
            const dniRegex = /^\d{8,9}$/;
            if (dniRegex.test(searchQuery)) {
                const encryptDniForSearch = encrypt(searchQuery);

                const result = await client.query(clientQueries[0], [encryptDniForSearch, user_id]);

                if (result.rowCount === 0) return res.status(400).json({ msg: "No se encontraron clientes con ese DNI." })
                const decryptedDni = decrypt(result.rows[0].client_dni);
                const decryptedPhone = decrypt(result.rows[0].client_phone);
                const decryptedAddress = decrypt(result.rows[0].client_address);

                const clientData = {
                    client_id: result.rows[0].client_id,
                    client_fullname: result.rows[0].client_fullname,
                    client_dni: decryptedDni,
                    client_phone: decryptedPhone,
                    client_address: decryptedAddress,
                    client_email: result.rows[0].client_email,
                    client_city: result.rows[0].client_city
                }

                return res.status(200).json({
                    clients: [clientData]
                })
            } else {
                const result = await client.query(clientQueries[1], [`%${searchQuery.toLowerCase()}%`, user_id]);
                if (result.rowCount === 0) return res.status(400).json({ msg: "No se encontraron clientes con ese nombre." })
                const decryptedDni = decrypt(result.rows[0].client_dni);
                const decryptedPhone = decrypt(result.rows[0].client_phone);
                const decryptedAddress = decrypt(result.rows[0].client_address);

                const clientData = result.rows.map((client) => ({
                    client_id: client.client_id,
                    client_fullname: client.client_fullname,
                    client_dni: decryptedDni,
                    client_phone: decryptedPhone,
                    client_address: decryptedAddress,
                    client_email: client.client_email,
                    client_city: client.client_city
                }))

                return res.status(200).json({
                    clients: clientData
                })
            }
        } else {
            const result = await client.query(clientQueries[2], [user_id]);
            if (result.rowCount === 0) return res.status(400).json({ msg: "No se encontraron clientes." })
            const decryptedDni = decrypt(result.rows[0].client_dni);
            const decryptedPhone = decrypt(result.rows[0].client_phone);
            const decryptedAddress = decrypt(result.rows[0].client_address);

            let clientsData = result.rows.map((client) => ({
                client_id: client.client_id,
                client_fullname: client.client_fullname,
                client_dni: decryptedDni,
                client_phone: decryptedPhone,
                client_address: decryptedAddress,
                client_email: client.client_email,
                client_city: client.client_city
            }))
            return res.status(200).json({
                clients: clientsData,
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

async function editClient(req, res) {
    const { client_fullname, client_dni, client_phone, client_address, client_email, client_city } = req.body;
    const { clientID } = req.query;
    let client;
    const user_id = req.user_id
    const { "editClient.sql": clientQueries } = queries;

    if (!clientQueries) {
        console.error("❌ Archivo de consultas de 'editClient' no encontrado");
        return res.status(500).json({ msg: "Error interno del servidor. Inténtalo más tarde." });
    }

    try {
        client = await pool.connect();

        const encryptedDni = encrypt(client_dni);
        const encryptedPhone = encrypt(client_phone);
        const encryptedAddress = encrypt(client_address);

        const result = await client.query(clientQueries[0], [client_fullname, encryptedDni, encryptedPhone, client_email, encryptedAddress, client_city, clientID, user_id]);
        if (result.rowCount === 0) return res.status(400).json({ msg: "No se pudo editar el cliente." })

        return res.status(200).json({ msg: "Cliente editado exitosamente." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
        })
    } finally {
        if (client) client.release();
    }
}

async function deleteClient(req, res) {
    const { clientID } = req.query;
    const user_id = req.user_id
    let client;

    try {
        client = await pool.connect();
        const result = await client.query("DELETE FROM clients WHERE client_id = $1 AND fk_user_id = $2", [clientID, user_id]);
        if (result.rowCount === 0) return res.status(400).json({ msg: "No se pudo eliminar el cliente." })
        return res.status(200).json({ msg: "Cliente eliminado exitosamente." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
        })
    } finally {
        if (client) client.release();
    }
}

async function getClientData(req, res) {
    let client
    const { "getClients.sql": clientQueries } = queries;

    if (!clientQueries) {
        console.error("❌ Archivo de consultas de 'getClientData' no encontrado");
        return res.status(500).json({ msg: "Error interno del servidor. Inténtalo más tarde." });
    }

    try {
        client = await pool.connect();
        const { clientID } = req.query
        const user_id = req.user_id
        const result = await client.query(clientQueries[3], [user_id, clientID]);
        if (result.rowCount === 0) return res.status(400).json({ msg: "No se pudo obtener los datos del cliente." })
        const decryptedDni = decrypt(result.rows[0].client_dni);
        const decryptedPhone = decrypt(result.rows[0].client_phone);
        const decryptedAddress = decrypt(result.rows[0].client_address);
        const clientData = {
            client_id: result.rows[0].client_id,
            client_fullname: result.rows[0].client_fullname,
            client_dni: decryptedDni,
            client_phone: decryptedPhone,
            client_address: decryptedAddress,
            client_email: result.rows[0].client_email,
            client_city: result.rows[0].client_city
        }
        return res.status(200).json({
            client: clientData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
        })
    } finally {
        if (client) {
            client.release();
        }
    }
};

const calculateDebtAmount = (debt) => {
    let total = 0;
    for (let i = 0; i < debt.length; i++) {
        const product = debt[i];

        const price = parseFloat(product.product_price) || 0;
        const quantity = parseInt(product.product_quantity) || 0;

        total += price * quantity;
    }
    return total;
};
async function getClientFinancialData(req, res) {
    const { "getClientFinancialData.sql": clientQueries } = queries;

    if (!clientQueries) {
        console.error("❌ Archivo de consultas de 'getClientFinancialData' no encontrado");
        return res.status(500).json({ msg: "Error interno del servidor. Inténtalo más tarde." });
    }

    const user_id = req.user_id;
    const { client_id } = req.query;
    let client;

    try {
        client = await pool.connect();
        const result = await client.query(clientQueries[0], [client_id, user_id]);
        
        if (result.rowCount === 0) return res.status(404).json({ msg: "No se encontraron deudas ni entregas de dinero para este cliente" });

        let clientDebts = result.rows[0].clientdebts || [];
        let clientDelivers = result.rows[0].clientdelivers || [];

        let totalDelivers = clientDelivers.reduce((acc, deliver) => {
            return acc + (parseFloat(deliver.deliver_amount) || 0);
        }, 0);

        clientDebts = clientDebts.map((debt) => {
            const debtTotal = calculateDebtAmount(debt.debt_products);

            return {
                debt_id: debt.debt_id,
                debt_amount: debt.debt_amount,
                debt_date: debt.debt_date,
                debt_products: debt.debt_products,
                debt_total: debtTotal, 
                debt_exp: debt.exp_date,
                debt_status: debt.debt_status === "active" ? "Al día" : "Vencido"
            };
        });

        const totalDebtAmount = clientDebts.reduce((acc, debt) => acc + debt.debt_total, 0) - totalDelivers;

        return res.status(200).json({
            clientDebts,
            totalDebtAmount,
            clientDelivers
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
        });
    } finally {
        if (client) client.release();
    }
}



module.exports = {
    createClient, getClients, editClient, deleteClient, getClientData, getClientFinancialData
};
