import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs"
import pool from "./connections/database_conn";
import redis from "./connections/redis_conn";

import path from "path";
import "dotenv/config"

import clientRouter from "./routes/clients.routes";
import AuthRouter from "./routes/auth.routes"
import debtRouter from "./routes/debts.routes";

const app = express();

app.use(cors());
app.use(express.json());


const testPostgresConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT VERSION()");
    console.log("✅ PostgreSQL:", result.rows[0]);
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
};

const testRedisConnection = async () => {
  try {
    await redis.set("test_key", "Redis andando....", "EX", 5);
    const valor = await redis.get("test_key");
    console.log("✅ Valor desde Redis:", valor);
  } catch (error) {
    console.log("❌ Error al iniciar la conexión a Redis:", error);
  }
};

testPostgresConnection();
testRedisConnection();

app.get("/", (req: Request, res: Response) => {
  res.send("SERVER ON");
});

app.use("/auth", AuthRouter)
app.use("/clients", clientRouter)
app.use("/debts", debtRouter)

app.get("/static/account-validation-success", (req: Request, res: Response) => {
  const htmlPath = path.join(__dirname, "./utils/Pages/EmailVerificationSuccess.html"); 
  const nodeEnv = process.env.NODE_ENV;

  const domains: Record<string, string> = {
    production: "https://fynkapp.com.ar/authentication",
    development: "http://localhost:5173/authentication",
  };

  const getDomain = (): string => {
    return domains[nodeEnv || "development"];
  };
  try {
    let htmlTemplate = fs.readFileSync(htmlPath, "utf-8");

    const url = new URL(`${getDomain()}/`); 
    htmlTemplate = htmlTemplate.replace("{{login_link}}", url.toString());

    res.setHeader('Content-Type', 'text/html');

    res.status(200).send(htmlTemplate);

  } catch (err) {
    console.error("Error reading or sending success HTML file:", err);
    res.status(500).send('Internal Server Error loading page');
  }
});


app.get("/static/account-validation-error", (req: Request, res: Response) => {
  const htmlPath = path.join(__dirname, "./utils/Pages/EmailVerificationError.html")
  res.status(200).sendFile(htmlPath, (err) => {
    if (err) {
      console.error("Error sending success HTML file:", err);
      res.status(500).send('Internal Server Error loading page');
    }
  });
});

app.listen(5000, () => {
  console.log(`🚀 Server listening on port ${5000}`);
});
