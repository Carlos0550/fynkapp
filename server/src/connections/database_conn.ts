import { Pool } from "pg";

const pool = process.env.NODE_ENV === "production"
  ? new Pool({
    connectionString: process.env.DATABASE_PUBLIC_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
  : new Pool({
    host: "localhost",
    database: "fynkapp_database",
    user: "postgres",
    password: "35218889",
    port: 5432
  });


export default pool