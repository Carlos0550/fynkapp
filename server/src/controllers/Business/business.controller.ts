import { ErrorRequestHandler, RequestHandler } from "express";
import pool from "../../connections/database_conn";
import { getQueries } from "../../utils/QueriesHandler";
import path from "path";
import { BusinessRequest } from "../../Types/BusinessTypes";

const queries = getQueries(path.join(__dirname, "./Queries"))

export const createBusiness: RequestHandler<
    {},{},BusinessRequest,{}
> = async (req,res) => {
    const { manager_id } = (req as any).manager_data
    const { 
        business_name,
        business_phone,
        business_address
    } = req.body
    const CB = queries["createBusiness.sql"]

    if(!CB){
        console.error("createBusiness.sql not found");
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
    try {
        await pool.query("BEGIN")
        const response = await pool.query(CB[0],[
            business_name.trim(),
            business_address.trim() || null,
            business_phone.trim(),
            manager_id
        ])

        if(response.rowCount! === 0){
            throw new Error("Algo inesperado ha ocurrido, por favor intenta nuevamente.")
        }

        await pool.query("COMMIT")
        res.status(200).json({msg:"Negocio creado exitosamente.", newBusinness: response.rows[0]})
        return
    } catch (error: any) {
        await pool.query("ROLLBACK")
        console.log(error)
        res.status(500).json({msg: error.message || "Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
}

export const editBusiness: RequestHandler<
{},{},BusinessRequest,{
    business_id:string
}> = async (req,res): Promise<void> => {
    const { 
        business_address, business_name, business_phone
    } = req.body

    const { business_id } = req.query

    const EB = queries["editBusiness.sql"]

    if(!EB){
        console.error("editBusiness.sql not found");
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }

    try {
        const response = await pool.query(EB[0],[
            business_name.trim(),
            business_phone.trim(),
            business_address.trim() || null,
            business_id
        ])

        if(response.rowCount! > 0){
            res.status(200).json({msg:"Información del negocio actualizada exitosamente."})
            return
        }else{
            res.status(400).json({msg:"Algo inesperado ha ocurrido, por favor intenta nuevamente."})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
}

export const changeNotification: RequestHandler<
{},{},{},{
    business_id: string,
    option: "email" | "whatsapp" | "both"
}
> = async (req, res): Promise<void> => {
    const {
        business_id, option
    } = req.query
    try {
        const result = await pool.query(`
            UPDATE business 
                SET 
                    notif_option = $1
                WHERE business_id = $2
            `, [option, business_id])

        if(result.rowCount! > 0){
            res.status(200).json({msg:"Notificaciones actualizadas exitosamente."})
            return
        }else{
            res.status(400).json({msg:"Algo inesperado ha ocurrido, por favor intenta nuevamente."})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
}

export const getBusinessData: RequestHandler = async (req,res) => {
    const { manager_id } = (req as any).manager_data
    const GBD = queries["getBusinessData.sql"]
    try {
        const response = await pool.query(GBD[0], [manager_id])

        if(response.rowCount! > 0){
            res.status(200).json(response.rows[0])
            return
        }else{
            res.status(404).json({msg:"No se encontraron negocios para este usuario."})
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Error interno en el servidor, espere unos segundos e intente nuevamente."})
        return
    }
}