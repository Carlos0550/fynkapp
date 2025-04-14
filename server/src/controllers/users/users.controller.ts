// src/controllers/authController.ts
import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { pool } from "../../database";
import { generateToken } from "../../routes/Security/JWT";

bcryptjs.setRandomFallback((length: number): number[] => {
  return Array.from(crypto.randomBytes(length));
});

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

const hashPassword = async (password: string): Promise<string | null> => {
  if (!password) return null;
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcryptjs.compare(password, hashedPassword);
  } catch (error) {
    console.log("Error al hacer la comparación entre hash y contraseña", error);
    return false;
  }
};

async function registerUser(req: Request, res: Response): Promise<Response> {
  const { "registerUser.sql": userQueries } = queries;

  if (!userQueries) {
    console.log("Archivo de consultas de USUARIOS no encontrado");
    return res.status(500).json({
      msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
    });
  }

  const { user_name, user_last_name, user_email, user_password } = req.body;
  const hashedPassword = await hashPassword(user_password);
  let client;

  try {
    client = await pool.connect();
    const result = await client.query(userQueries[0], [user_email]);
    const userExists = result.rows[0].count > 0;

    if (userExists) {
      return res.status(400).json({
        msg: "El correo electrónico ya está registrado."
      });
    } else {
      const insertResult = await client.query(userQueries[1], [
        user_name,
        user_last_name,
        user_email,
        hashedPassword
      ]);

      if (insertResult.rowCount === 0) return res.status(400).json({
        msg: "Error al crear el usuario"
      });

      return res.status(200).json({
        msg: "El usuario ha sido registrado exitosamente."
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
    });
  } finally {
    if (client) client.release();
  }
}

async function loginUser(req: Request, res: Response): Promise<Response> {
  const { user_email, user_password } = req.body;
  const { "loginUser.sql": userQueries } = queries;

  if (!userQueries) {
    console.log("Archivo de consultas de USUARIOS no encontrado");
    return res.status(500).json({
      msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
    });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(userQueries[0], [user_email]);
    const userExists = result.rows[0].count > 0;

    if (userExists) {
      const userResult = await client.query(userQueries[1], [user_email]);
      if (userResult.rowCount === 0) {
        return res.status(400).json({
          msg: "No existe un usuario con ese correo, verifique e inténtelo de nuevo."
        });
      }

      const user = userResult.rows[0];
      const passwordMatch = await comparePassword(user_password, user.user_password);
      if (!passwordMatch) {
        return res.status(400).json({ msg: "Contraseña incorrecta" });
      }

      const token = await generateToken({
        user_id: user.user_id,
        user_name: user.user_name,
        user_last_name: user.user_last_name,
        user_email: user.user_email
      });

      return res.status(200).json({
        msg: "El usuario ha iniciado sesión exitosamente.",
        token
      });
    } else {
      return res.status(400).json({
        msg: "El correo electrónico no está registrado."
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error interno del servidor, espera unos segundos y vuelve a intentarlo."
    });
  } finally {
    if (client) client.release();
  }
}

export {
  registerUser,
  loginUser
};