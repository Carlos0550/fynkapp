const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const privateKeyPath = path.join(__dirname, "private-key.pem");
const publicKeyPath = path.join(__dirname, "public-key.pem");

async function getPrivateKey() {
    try {
        if (fs.existsSync(privateKeyPath)) {
            return await fs.promises.readFile(privateKeyPath, "utf8");
        } else if (process.env.PRIVATE_KEY) {
            const formatted = process.env.PRIVATE_KEY.replace(/\\n/g, '\n').trim();
            return formatted;
        } else {
            throw new Error("No se encontró una clave privada válida.");
        }
    } catch (error) {
        console.error("❌ Error al obtener la clave privada:", error);
        throw error;
    }
}

async function getPublicKey() {
    try {
        if (fs.existsSync(publicKeyPath)) {
            return await fs.promises.readFile(publicKeyPath, "utf8");
        } else if (process.env.PUBLIC_KEY) {
            const formatted = process.env.PUBLIC_KEY.replace(/\\n/g, '\n').trim();
            return formatted;
        } else {
            throw new Error("No se encontró una clave pública válida.");
        }
    } catch (error) {
        console.error("❌ Error al obtener la clave pública:", error);
        throw error;
    }
}

const generateToken = async (payload) => {
    try {
        const now = new Date();
        const expiresAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const diffMs = expiresAt.getTime() - now.getTime();
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

        const privateKey = await getPrivateKey();

        const { user_password, ...user } = payload;

        const token = jwt.sign(user, privateKey, {
            algorithm: "ES256",
            expiresIn: `${diffHours}h`,
        });

        return token;
    } catch (error) {
        console.error("❌ Error al generar el token:", error);
        throw new Error("No fue posible generar el token");
    }
};

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "No se detectó el token de usuario, reintente cerrando e iniciando sesión nuevamente." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Sesión expirada o no válida." });
    }

    try {
        const publicKey = await getPublicKey();

        const decoded = jwt.verify(token, publicKey, { algorithms: ["ES256"] });

        req.user = decoded;
        req.user_id = decoded.user_id;
        next();
    } catch (error) {
        console.error("❌ Error al verificar token:", error.message);
        return res.status(401).json({ msg: "Sesión expirada o no válida." });
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
