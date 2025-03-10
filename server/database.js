const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "fynkapp",
//     password: "35218889",
//     port: 5432,
// });

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
})

async function verifyDbConnection() {
    try {
        const client = await pool.connect()
        const result = await client.query("SELECT VERSION()")
        console.log(result.rows[0].version)
        console.log("Database connected")
        client.release()
        console.log("Database connection released")
    } catch (error) {
        console.error("Error connecting to the database:", error)
        process.exit(1)
    }
}

module.exports = {
    pool,
    verifyDbConnection
};