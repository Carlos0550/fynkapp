// src/controllers/fastPaymentController.ts
import { Request, Response } from "express";
import { pool } from "../../database";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import dayjs from "dayjs";

dotenv.config();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
const iv = Buffer.from(process.env.ENCRYPTION_IV || "", "hex");

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

let queries: Record<string, string[]> = {};
(async () => {
  try {
    const files = await fs.readdir(path.join(__dirname, "./Queries"));
    const sqlFiles = files.filter(file => file.endsWith(".sql"));

    await Promise.all(sqlFiles.map(async (file) => {
      const filePath = path.join(__dirname, "./Queries", file);
      const content = await fs.readFile(filePath, "utf-8");
      const queriesArray = content
        .split(";")
        .map(query => query.trim())
        .filter(query => query.length > 0);
      queries[file] = queriesArray;
    }));
  } catch (error) {
    console.error("Error cargando archivos SQL:", error);
  }
})();

interface AuthenticatedRequest<TQuery = {}, TBody = {}> extends Request<{}, {}, TBody, TQuery> {
  user_id: string;
  user?: { user_id: string; [key: string]: any };
}

interface Deliver {
  deliver_amount: string;
}

interface Product {
  product_price: string;
  product_quantity: string;
}

interface Debt {
  debt_products: Product[];
}

interface ClientData {
  client_id: string;
  client_name: string;
  total: number;
}

async function retrieveClientData(req: AuthenticatedRequest<{ client_dni: string }>, res: Response): Promise<Response> {
  const { "FastRegisterPayment.sql": FRPQueries } = queries;
  const user_id = req.user_id;
  const { client_dni } = req.query;

  if (!FRPQueries) {
    console.error("Error cargando archivos SQL FastRegisterPayment.sql");
    return res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
  }

  let client;
  try {
    client = await pool.connect();
    const encryptedDni = encrypt(client_dni);
    const result = await client.query(FRPQueries[0], [encryptedDni, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No se encontraron datos del cliente" });
    }

    const { client_id, client_fullname } = result.rows[0];
    let clientData: ClientData = { client_id, client_name: client_fullname, total: 0 };

    const debtData = await client.query(FRPQueries[1], [client_id, user_id]);
    const clientDebts: Debt[] = debtData.rows[0]?.clientdebts || [];
    const clientDelivers: Deliver[] = debtData.rows[0]?.clientdelivers || [];

    const totalDelivers = clientDelivers.reduce((acc, deliver) => acc + parseFloat(deliver.deliver_amount || "0"), 0);
    const totalProductsDebt = clientDebts.reduce((acc, debt) => {
      if (!debt.debt_products) return acc;
      return acc + debt.debt_products.reduce((subAcc, prod) => {
        return subAcc + (parseFloat(prod.product_price || "0") * parseInt(prod.product_quantity || "0"));
      }, 0);
    }, 0);

    clientData.total = totalProductsDebt - totalDelivers;
    return res.status(200).json({ clientData });
  } catch (error) {
    console.error("Error en retrieveClientData:", error);
    return res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
  } finally {
    if (client) client.release();
  }
}

async function saveDeliver(req: AuthenticatedRequest<{ client_id: string; payment_amount: string }>, res: Response): Promise<Response> {
  const { "FastRegisterPayment.sql": FRPQueries } = queries;
  const { client_id, payment_amount } = req.query;
  const user_id = req.user_id;

  if (!FRPQueries) {
    console.error("Error cargando archivos SQL FastRegisterPayment.sql");
    return res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
  }

  let client;
  try {
    client = await pool.connect();
    const debtData = await client.query(FRPQueries[1], [client_id, user_id]);
    const clientDebts: Debt[] = debtData.rows[0]?.clientdebts || [];
    const clientDelivers: Deliver[] = debtData.rows[0]?.clientdelivers || [];

    const totalDelivers = clientDelivers.reduce((acc, deliver) => acc + parseFloat(deliver.deliver_amount || "0"), 0);
    const totalProductsDebt = clientDebts.reduce((acc, debt) => {
      if (!debt.debt_products) return acc;
      return acc + debt.debt_products.reduce((subAcc, prod) => {
        return subAcc + (parseFloat(prod.product_price || "0") * parseInt(prod.product_quantity || "0"));
      }, 0);
    }, 0);

    const total = totalProductsDebt - totalDelivers;
    if (total < parseFloat(payment_amount)) {
      return res.status(400).json({ message: "El monto a entregar es mayor al total de la deuda" });
    }

    const today = dayjs().format("YYYY-MM-DD");
    await client.query(FRPQueries[2], [client_id, user_id, payment_amount, today]);
    return res.status(200).json({ message: "Entrega registrada correctamente" });
  } catch (error) {
    console.error("Error en saveDeliver:", error);
    return res.status(500).json({ msg: "Error interno del servidor, espere unos segundos e intente nuevamente." });
  } finally {
    if (client) client.release();
  }
}

export {
  retrieveClientData,
  saveDeliver
};