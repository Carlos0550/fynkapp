import path from "path";
import pool from "../../connections/database_conn";
import { getQueries } from "../../utils/QueriesHandler";
import { RequestHandler } from "express";
import { DebtRequest } from "../../Types/DebtsTypes";
import dayjs from "dayjs";
import { generateRandomKey } from "../../Security/EncryptationModule";

const queries = getQueries(path.join(__dirname, "./Queries"))

export const saveDebt: RequestHandler<
{},{},
DebtRequest,{client_id:string}> = async (
    req,
    res
): Promise<void> => {
    const { manager_id } = (req as any).manager_data
    const { client_id } = req.query
    const {
        debt_date,
        debt_products,
        debt_total
    } = req.body
    const debtQueries = queries["saveDebt.sql"]
    if(!debtQueries){
        console.error("❌ Error al obtener las consultas de guardar el deuda.")
        res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." })
        return
    }
    try {
        const debt_id = generateRandomKey(16)
        const response = await pool.query(debtQueries[0],[
            debt_total,
            debt_date,
            dayjs(debt_date).add(1, "month").format("YYYY-MM-DD HH:mm:ss"),
            manager_id,
            client_id,
            JSON.stringify(debt_products),
            debt_id
        ])

        if(response.rowCount! > 0){
            res.status(200).json({ msg: "Deuda guardada con exito"})
            return
        }else{
            throw new Error("Error desconocido al guardar la deuda")
        }
    } catch (error) {
        console.error("❌ Error al guardar la deuda:", error);
        res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
        return
    }

}