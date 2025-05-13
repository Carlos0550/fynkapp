// src/controllers/clientController.ts
import { Request, Response } from "express";
import { pool } from "../../database";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

interface CustomRequest extends Request {
  user_id?: string;
}

interface ClientRow {
  client_id: string;
  client_fullname: string;
  client_dni: string | undefined;
  client_phone?: string | undefined;
  client_email?: string;
  client_city?: string;
}

interface DebtProduct {
  product_price: string;
  product_quantity: string;
}

interface ClientDebt {
  debt_id: string;
  debt_amount: string;
  debt_total: number;
  debt_date: string;
  debt_products: DebtProduct[];
  exp_date: string;
  debt_status: string;
}

interface ClientDeliver {
  deliver_amount: string;
}

let queries: Record<string, string[]> = {};

(async () => {
  try {
    const files = await fs.readdir(path.join(__dirname, "./Queries"));
    const sqlFiles = files.filter((file) => file.endsWith(".sql"));

    await Promise.all(
      sqlFiles.map(async (file) => {
        const filePath = path.join(__dirname, "./Queries", file);
        const content = await fs.readFile(filePath, "utf-8");
        const queriesArray = content
          .split(";")
          .map((query) => query.trim())
          .filter((query) => query.length > 0);
        queries[file] = queriesArray;
      })
    );
    console.log("✅ Archivos SQL de clientes cargados exitosamente");
  } catch (error) {
    console.error("❌ Error cargando archivos SQL:", error);
    process.exit(1);
  }
})();

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
  if(!encryptedText) return "";
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

async function createClient(req: CustomRequest, res: Response) {
  const { "createClient.sql": clientQueries } = queries;
  const user_id = req.user_id;
console.log(user_id)
  if (!clientQueries) {
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  }

  let client;
  const { client_fullname, client_dni, client_phone, client_email } = req.body;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const encryptedDni = client_dni ? encrypt(client_dni) : null;
    const encryptedPhone = client_phone ? encrypt(client_phone) : null;

    if(encryptedDni){
      const result1 = await client.query(clientQueries[0], [encryptedDni, user_id]);
      if (result1.rows[0]?.count > 0) {
        throw new Error("Ya existe un cliente con ese DNI.");
      }
    }

    const result = await client.query(clientQueries[1], [
      client_fullname,
      client_email || null,
      encryptedPhone,
      encryptedDni || null,
      user_id
    ]);

    if (result.rowCount === 0) {
      throw new Error("Error desconocido al crear el cliente.");
    }

    await client.query("COMMIT");
    res.status(200).json({ msg: "Cliente creado exitosamente." });
    return
  } catch (error: any) {
    console.error("Error al crear cliente:", error);
    if (client) await client.query("ROLLBACK");
    res.status(400).json({ msg: error.message || "Error interno del servidor.", error });
    return
  } finally {
    if (client) client.release();
  }
}

async function getClients(req: CustomRequest, res: Response) {
  const { "getClients.sql": clientQueries } = queries;
  const user_id = req.user_id;

  if (!clientQueries) {
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  }

  let client;
  const { searchQuery } = req.query as { searchQuery: string };
  try {
    client = await pool.connect();
    if (searchQuery !== "") {
      const dniRegex = /^\d{8,9}$/;
      if (dniRegex.test(searchQuery)) {
        const encryptedDni = encrypt(searchQuery);
        const result = await client.query(clientQueries[0], [encryptedDni, user_id]);
        if (result.rowCount === 0) {
          res.status(400).json({ msg: "No se encontraron clientes con ese DNI." });
          return
        }

        const row = result.rows[0];
        const clientData: ClientRow = {
          client_id: row.client_id,
          client_fullname: row.client_fullname,
          client_dni: row.client_dni ? decrypt(row.client_dni) : undefined,
          client_phone: row.client_phone ? decrypt(row.client_phone) : undefined,
          client_email: row.client_email,
          client_city: row.client_city
        };
        res.status(200).json({ clients: [clientData] });
        return
      } else {
        const result = await client.query(clientQueries[1], [`%${searchQuery.toLowerCase()}%`, user_id]);
        if (result.rowCount === 0) {
          res.status(400).json({ msg: "No se encontraron clientes con ese nombre." });
          return
        }

        const clients = result.rows.map((row): ClientRow => ({
          client_id: row.client_id,
          client_fullname: row.client_fullname,
          client_dni: row.client_dni ? decrypt(row.client_dni) : undefined,
          client_phone: row.client_phone ? decrypt(row.client_phone) : undefined,
          client_email: row.client_email,
          client_city: row.client_city
        }));
        res.status(200).json({ clients });
        return
      }
    } else {
      const result = await client.query(clientQueries[2], [user_id]);
      if (result.rowCount === 0) {
        res.status(400).json({ msg: "No se encontraron clientes." });
        return
      }

      const clients = result.rows.map((row): ClientRow => ({
        client_id: row.client_id,
        client_fullname: row.client_fullname,
        client_dni: row.client_dni ? decrypt(row.client_dni) : undefined,
        client_phone: row.client_phone ? decrypt(row.client_phone) : undefined,
        client_email: row.client_email
      }));
      res.status(200).json({ clients });
      return
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  } finally {
    if (client) client.release();
  }
}

async function editClient(req: CustomRequest, res: Response) {
  const { client_fullname, client_dni, client_phone, client_email } = req.body;
  const { clientID } = req.query as { clientID: string };
  const user_id = req.user_id;
  const { "editClient.sql": clientQueries } = queries;

  if (!clientQueries) {
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  }

  let client;
  try {
    client = await pool.connect();
    const encryptedDni = client_dni ? encrypt(client_dni) : null;
    const encryptedPhone = client_phone ? encrypt(client_phone) : null;

    const result = await client.query(clientQueries[0], [client_fullname, encryptedDni || null, encryptedPhone || null, client_email || null, clientID, user_id]);
    if (result.rowCount === 0) {
      res.status(400).json({ msg: "No se pudo editar el cliente." });
      return
    }

    res.status(200).json({ msg: "Cliente editado exitosamente." });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  } finally {
    if (client) client.release();
  }
}

async function deleteClient(req: CustomRequest, res: Response) {
  const { clientID } = req.query as { clientID: string };
  const user_id = req.user_id;
  let client;

  try {
    client = await pool.connect();
    const result = await client.query("DELETE FROM clients WHERE client_id = $1 AND fk_user_id = $2", [clientID, user_id]);
    if (result.rowCount === 0) {
      res.status(400).json({ msg: "No se pudo eliminar el cliente." });
      return
    }
    res.status(200).json({ msg: "Cliente eliminado exitosamente." });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  } finally {
    if (client) client.release();
  }
}

async function getClientData(req: CustomRequest, res: Response) {
  const { clientID } = req.query as { clientID: string };
  const user_id = req.user_id;
  const { "getClients.sql": clientQueries } = queries;

  if (!clientQueries) {
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(clientQueries[3], [user_id, clientID]);
    if (result.rowCount === 0) {
      res.status(400).json({ msg: "No se pudo obtener los datos del cliente." });
      return
    }

    const row = result.rows[0];
    const clientData: ClientRow = {
      client_id: row.client_id,
      client_fullname: row.client_fullname,
      client_dni: decrypt(row.client_dni),
      client_phone: row.client_phone ? decrypt(row.client_phone) : undefined,
      client_email: row.client_email,
      client_city: row.client_city
    };

    res.status(200).json({ client: clientData });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  } finally {
    if (client) client.release();
  }
}

function calculateDebtAmount(debt: DebtProduct[]): number {
  return debt.reduce((total, product) => {
    const price = parseFloat(product.product_price) || 0;
    const quantity = parseInt(product.product_quantity) || 0;
    return total + price * quantity;
  }, 0);
}

async function getClientFinancialData(req: CustomRequest, res: Response) {
  const { client_id } = req.query as { client_id: string };
  const user_id = req.user_id;
  const { "getClientFinancialData.sql": clientQueries } = queries;

  if (!clientQueries) {
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(clientQueries[0], [client_id, user_id]);
    if (result.rowCount === 0) {
      res.status(404).json({ msg: "No se encontraron deudas ni entregas." });
      return
    }

    let clientDebts: ClientDebt[] = result.rows[0].clientdebts || [];
    const clientDelivers: ClientDeliver[] = result.rows[0].clientdelivers || [];

    const totalDelivers = clientDelivers.reduce((acc, d) => acc + (parseFloat(d.deliver_amount) || 0), 0);

    clientDebts = clientDebts.map((debt) => ({
      ...debt,
      debt_total: calculateDebtAmount(debt.debt_products),
      debt_status: debt.debt_status === "active" ? "Al día" : "Vencido"
    }));

    const totalDebtAmount = clientDebts.reduce((acc, d) => acc + d.debt_total, 0) - totalDelivers;

    res.status(200).json({ clientDebts, totalDebtAmount, clientDelivers });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor." });
    return
  } finally {
    if (client) client.release();
  }
}

export {
  createClient,
  getClients,
  editClient,
  deleteClient,
  getClientData,
  getClientFinancialData
};
