const { pool } = require("../../database.js")
const fs = require("fs").promises
const path = require("path")
const dayjs = require("dayjs")

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

async function createDeliver(req,res) {
    const { "createDeliver.sql": dsqueries } = queries 

    if(!dsqueries){
        console.log("Arhciov SQL createDeliver NO ENCONTRADO")
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    }

    const { 
        deliver_date, 
        deliver_amount, 
        deliver_client_id,
    } = req.body
    const user_id = req.user_id
    let client;
    try {
        client = await pool.connect()
        const response = await client.query(dsqueries[0],[
            Number(deliver_amount),
            dayjs(deliver_date).format("YYYY-MM-DD"),
            deliver_client_id,
            user_id
        ])

        if(response.rowCount === 0) return res.status(400).json({ msg: "No se pudo crear la entrega" })
        return res.status(200).json({ msg: "Entrega creada exitosamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    }finally{
        if(client) await client.release()
    }
}

module.exports = {
    createDeliver
}