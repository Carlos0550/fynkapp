import { RequestHandler } from "express"
import pool from "../../connections/database_conn"
import { ClientsFromDB, ClientsRequest } from "../../Types/ClientsTypes"
import { getQueries } from "../../utils/QueriesHandler"
import path from "path"
import { encryptData } from "../../Security/EncryptationModule"
import { decrypt } from "../../Security/EncryptationModule"

const queries = getQueries(path.join(__dirname, "./Queries"))
export const saveClient: RequestHandler<{}, {}, ClientsRequest, { editing_client?: string, client_id?: string }> = async (
    req,
    res
): Promise<void> => {
    const {
        client_name,
        client_dni,
        client_email,
        client_address
    } = req.body
    const { editing_client } = req.query
    const parsedBoolean = editing_client === "true" ? true : false

    const manager_client_id = (req as any).manager_data.manager_id
    const clientQuery = queries["saveClient.sql"]
    try {
        const encryptedDNI = client_dni ? encryptData(client_dni) : null
        const encryptedEmail = client_email ? encryptData(client_email) : null
        const encryptedAddress = client_address ? encryptData(client_address) : null

        const dataToSave = {
            client_dni: encryptedDNI,
            client_email: encryptedEmail,
            client_address: encryptedAddress
        }
        if (parsedBoolean) {
            const result = await pool.query(clientQuery[2], [client_name, JSON.stringify(dataToSave), req.query.client_id])
            if(result.rowCount! > 0) {
                res.status(200).json({ msg: "Cliente actualizado con exito", updatedClient: result.rows[0] })
                return;
            }else{
                res.status(400).json({
                    msg: "Error al actualizar el cliente, espere unos segundos e intente nuevamente."
                })
                return;
            }
        } else {
            if (encryptedDNI && client_dni) {
                const result1 = await pool.query(clientQuery[0], [manager_client_id, encryptedDNI])

                if (result1.rows[0].count === 0) {
                    res.status(400).json({ msg: "Ya existe un cliente con el DNI ingresado." })
                    return
                }
            }

            const result2 = await pool.query(clientQuery[1], [manager_client_id, JSON.stringify(dataToSave), client_name])

            if (result2.rowCount! > 0) {
                res.status(200).json({ msg: "Cliente guardado con exito" })
            } else {
                res.status(400).json({
                    msg: "Error al guardar el cliente, espere unos segundos e intente nuevamente."
                })
            }
        }

    } catch (error) {
        console.error("❌ Error al guardar el cliente:", error);
        res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente." });
    }
}

export const GetAllClients: RequestHandler = async (
    req,
    res
): Promise<void> => {
    const { manager_id } = (req as any).manager_data
    const clientQuery = `
    SELECT client_name, client_id FROM clients WHERE manager_client_id = $1 ORDER BY client_name ASC;
    `

    try {
        const result = await pool.query(clientQuery, [manager_id])
        if (result.rowCount === 0) {
            res.status(404).json({ msg: "No se encontraron clientes." })
            return
        } else {
            res.status(200).json(result.rows)
            return
        }
    } catch (error) {
        console.error("❌ Error al obtener los clientes:", error);
        res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente." });
        return;
    }
}

export const getClientData: RequestHandler<{}, {}, {}, { client_id: string }> = async (
    req, res
): Promise<void> => {
    const { client_id } = req.query
    const clientQuery = `
    SELECT * FROM clients WHERE client_id = $1;
    `
    try {
        const result = await pool.query(clientQuery, [client_id])
        if (result.rowCount === 0) {
            res.status(404).json({ msg: "No se encontraron clientes con el ID ingresado." })
            return
        } else {
            const aditionalData: ClientsFromDB["aditional_client_data"] = result.rows[0].client_aditional_data

            const decryptedDNI = aditionalData.client_dni ? decrypt(aditionalData.client_dni) : null
            const decryptedEmail = aditionalData.client_email ? decrypt(aditionalData.client_email) : null
            const decryptedAddress = aditionalData.client_address ? decrypt(aditionalData.client_address) : null

            const client = {
                client_id: result.rows[0].client_id,
                client_name: result.rows[0].client_name,
                manager_client_id: result.rows[0].manager_client_id,
                aditional_client_data: {
                    client_dni: decryptedDNI,
                    client_email: decryptedEmail,
                    client_address: decryptedAddress
                }
            }

            res.status(200).json(client)
            return
        }
    } catch (error) {
        console.error("❌ Error al obtener los clientes:", error);
        res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente." });
        return;
    }
}