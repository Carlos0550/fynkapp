import path from "path";
import pool from "../../connections/database_conn";
import { getQueries } from "../../utils/QueriesHandler";
import { RequestHandler } from "express";
import { DebtRequest } from "../../Types/DebtsTypes";
import dayjs from "dayjs";
import { generateRandomKey } from "../../Security/EncryptationModule";

const queries = getQueries(path.join(__dirname, "./Queries"))

async function getDebtById(debt_id: string) {
    const result = await pool.query("SELECT debt_date, exp_date FROM debts WHERE debt_id = $1", [debt_id]);
    return result.rows[0];
}

export const saveDebt: RequestHandler<
    {}, {}, DebtRequest, { client_id: string, editing: string, debt_id: string }> = async (
        req,
        res
    ): Promise<void> => {
        const { manager_id } = (req as any).manager_data
        const { client_id, editing, debt_id } = req.query
        const {
            debt_date,
            debt_products,
            debt_total
        } = req.body
        const debtQueries = queries["saveDebt.sql"]
        if (!debtQueries) {
            console.error("❌ Error al obtener las consultas de guardar el deuda.")
            res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." })
            return
        }
        try {
            const parsedBoolean = editing === "true" ? true : false

            if (parsedBoolean) {
                const oldDebt = await getDebtById(debt_id!)
                const oldDebtDate = dayjs(oldDebt.debt_date)
                const newDebtDate = dayjs(debt_date)
                const shouldUpdate = Math.abs(newDebtDate.diff(oldDebtDate, "day")) >= 2

                const newExpDate = shouldUpdate
                    ? newDebtDate.add(1, "month").format("YYYY-MM-DD HH:mm:ss")
                    : oldDebt.exp_date;

                const response = await pool.query(debtQueries[1], [
                    debt_total,
                    debt_date,
                    newExpDate,
                    JSON.stringify(debt_products),
                    debt_id
                ])

                if (response.rowCount! > 0) {
                    res.status(200).json({ msg: "Deuda actualizada con exito" })
                    return
                } else {
                    throw new Error("Error desconocido al actualizar la deuda")
                }
            } else {
                const debt_id = generateRandomKey(16)
                const response = await pool.query(debtQueries[0], [
                    debt_total,
                    debt_date,
                    dayjs(debt_date).add(1, "month").format("YYYY-MM-DD HH:mm:ss"),
                    manager_id,
                    client_id,
                    JSON.stringify(debt_products),
                    debt_id
                ])

                if (response.rowCount! > 0) {
                    res.status(200).json({ msg: "Deuda guardada con exito" })
                    return
                } else {
                    throw new Error("Error desconocido al guardar la deuda")
                }
            }
        } catch (error) {
            console.error("❌ Error al guardar la deuda:", error);
            res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
            return
        }

    }


export const deleteDebt: RequestHandler<
    {}, 
    {}, 
    {}, {
        debt_id: string
        client_id: string
    }
> = async (
    req, res
): Promise<void> => {
        const {
            client_id, debt_id
        } = req.query
        const { manager_id } = (req as any).manager_data
        const db = queries["deleteDebt.sql"]
        if (!db) {
            console.error("❌ Error al obtener las consultas de eliminar la deuda.")
            res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." })
            return
        }
        try {
            const responseDebtsWithoutThisDebt = await pool.query(db[0], [client_id, manager_id, debt_id])
   
            const responseTotalDelivers = await pool.query(db[1], [client_id, manager_id])

            if (responseTotalDelivers.rows[0].count! > 0) {
                res.status(400).json({
                    msg: "La deuda no pudo ser eliminada porque el cliente ya tiene entregas de dinero."
                })
                return
            }

            const responseSumDebtsAndDelivers = await pool.query(db[2], [client_id, manager_id, debt_id])
            const debt_total_without_this_debt = Number(responseSumDebtsAndDelivers.rows[0].total_other_debts)
            const delivers_total = Number(responseSumDebtsAndDelivers.rows[0].total_delivers)

            if (debt_total_without_this_debt < delivers_total) {
                res.status(400).json({
                    msg: "La deuda no pudo ser eliminada porque el saldo total corre riesgo de ser negativo."
                })
                return
            }
        
            const haveOnlyThisDebt = Number(responseDebtsWithoutThisDebt.rows[0].count) === 0

            if (haveOnlyThisDebt) {
                const deleteDebtsAndDelivers = await Promise.all([
                    pool.query(db[3], [debt_id]),
                    pool.query(db[4], [client_id, manager_id])
                ])
                console.log(deleteDebtsAndDelivers)
                if (deleteDebtsAndDelivers.every(response => response.rowCount! > 0)) {
                    res.status(200).json({ msg: "Deuda eliminada con exito." })
                    return
                } else {
                    throw new Error("Error desconocido al eliminar la deuda")
                }
            } else {
                const deleteOnlyThisDebt = await pool.query(db[3], [debt_id])

                if (deleteOnlyThisDebt.rowCount! > 0) {
                    res.status(200).json({ msg: "Deuda eliminada con exito." })
                    return
                } else {
                    throw new Error("Error desconocido al eliminar la deuda")
                }
            }
        } catch (error) {
            console.error("❌ Error al eliminar la deuda:", error);
            res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
            return
        }
    }