import { RequestHandler } from "express"
import pool from "../../connections/database_conn"
import { ClientsRequest } from "../../Types/ClientsTypes"
import { getQueries } from "../../utils/QueriesHandler"
import path from "path"
import { encryptData } from "../../Security/EncryptationModule"

const queries = getQueries(path.join(__dirname, "./Queries"))
export const saveClient: RequestHandler<{},{},ClientsRequest,{}> = async (
    req,
    res
): Promise<void> => {
    const {
        client_name,
        client_dni,
        client_email,
        client_address
    } = req.body
    const manager_client_id = (req as any).manager_id
    
    const clientQuery = queries["saveClient.sql"]
    try {
        const encryptedDNI = client_dni ? encryptData(client_dni) : null
        if(encryptedDNI && client_dni){
            const result1 = await pool.query(clientQuery[0], [manager_client_id, encryptedDNI])
            if(result1.rows[0].count === 0){
                res.status(400).json({msg:"Ya existe un cliente con el DNI ingresado."})
                return
            }
        }

        const encryptedEmail = client_email ? encryptData(client_email) : null
        const encryptedAddress = client_address ? encryptData(client_address) : null
        
        const dataToSave = {
            encryptedDNI,
            encryptedEmail,
            encryptedAddress
        }
        
        const result2 = await pool.query(clientQuery[1],[manager_client_id,JSON.stringify(dataToSave), client_name])

        if(result2.rowCount! > 0){
            res.status(200).json({msg:"Cliente guardado con exito"})
        }else{
            res.status(400).json({
                msg: "Error al guardar el cliente, espere unos segundos e intente nuevamente."
            })
        }

    } catch (error) {
        console.error("❌ Error al guardar el cliente:", error);
        res.status(500).json({ msg: "Error interno en el servidor, espere unos segundos e intente nuevamente." });
    }
}
