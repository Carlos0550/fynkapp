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
            const filePath = path.join(__dirname, "./Queries", file)
            const content = await fs.readFile(filePath, "utf-8")
            const queriesArray = content
                .split(";")
                .map(query => query.trim())
                .filter(query => query.length > 0)

            queries[file] = queriesArray
        }))

    } catch (error) {
        console.error("Error cargando archivos SQL:", error)
    }
})();

async function saveEmployeer(req,res){
    const { "saveEmployeer.sql": SEQueries } = queries;

    if(!SEQueries){
        console.log("Error al cargar el archivo saveEmployeer.sql")
        return res.status(400).json({
            message: "Error interno del servidor, espere unos segundos e intente nuevamente."
        })
    }

    const {
        employeer_name,
        employeer_email,
        employee_role,
        
    } = req.query
}