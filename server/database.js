const { Pool } = require("pg");
require("dotenv").config();


const development_environment = {
    user: "postgres",
    host: "localhost",
    database: "fynkapp_database",
    password: "35218889",
    port: 5432,
}
    
//const pool = new Pool(development_environment);

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
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