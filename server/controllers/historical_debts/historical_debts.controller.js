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