import crypto from "crypto";
import "dotenv/config";

const algorithm = "aes-256-ecb";

const getSecret = (): Buffer => {
    const secret = process.env.SECRET_KEY_ENCRYPTION;
    if (!secret) throw new Error("Secret key not found. Generate one with: openssl rand -hex 32");
    return Buffer.from(secret, "hex"); 
};

export const encryptData = (data: string): string => {
    const cipher = crypto.createCipheriv(algorithm, getSecret(), null); 
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

export const decrypt = (encryptedText: string): string => {
    const decipher = crypto.createDecipheriv(algorithm, getSecret(), null);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

export function generateRandomKey(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  const randomBytes = new Uint8Array(length);

  crypto.getRandomValues(randomBytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    // Usamos el operador modulo (%) para obtener un índice dentro del rango de charactersLength
    // Aunque esto puede introducir un sesgo mínimo si 256 no es un múltiplo exacto de charactersLength,
    // para la mayoría de los propósitos de generación de claves/IDs es aceptable.
    const randomIndex = randomBytes[i] % charactersLength;
    result += characters.charAt(randomIndex);
  }

  return result;
}