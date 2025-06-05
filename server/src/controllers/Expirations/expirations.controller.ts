import pool from "../../connections/database_conn";
import { RequestHandler } from "express";

export const getExpirations: RequestHandler<
{},{},{},{business_id: string}
> = async (req, res): Promise<void> => {
    const { business_id } = req.query
    try {
        const response = await pool.query("SELECT * FROM expired_debts WHERE expired_business_id = $1", [business_id])
        if(response.rowCount! > 0){
            res.status(200).json(response.rows)
            return
        }else{
            res.status(404).json({msg:"No se encontraron vencimientos para este negocio."})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    } 
}