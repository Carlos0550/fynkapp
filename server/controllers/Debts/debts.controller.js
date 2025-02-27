const { pool } = require("../../database.js")
const fs = require("fs").promises
const path = require("path")

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

async function createDebt(req,res) {
    const { "createDebt.sql": dtqueries } = queries

    if(!dtqueries){
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
        const response = await client.query(dtqueries[0],[client_id, debt_products, debt_date, user_id])
        if(response.rowCount === 0) return res.status(400).json({ msg: "No se pudo crear la deuda" })
        return res.status(200).json({ msg: "Deuda creada exitosamente" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    }finally{
        if(client) await client.release()
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
  }finally{
    if(client) await client.release()
  }
}

async function deleteDebt(req,res) {
    const { debtID } = req.query
    const { "deleteDebt.sql": dtqueries } = queries

    if(!dtqueries){
        console.log("Arhciov SQL deleteDebt NO ENCONTRADO")
        return res.status(500).json({
            msg: "Error interno en el servidor, espere unos segundos e intente nuevamente"
        })
    }

    let client;

    try {
        client = await pool.connect()
        const response = await client.query(dtqueries[0],[debtID])
        if(response.rowCount === 0) return res.status(400).json({ msg: "No se pudo eliminar la deuda" })
        return res.status(200).json({ msg: "Deuda eliminada exitosamente" })
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
    createDebt, editDebt, deleteDebt
}