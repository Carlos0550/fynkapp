const jwt = require("jsonwebtoken")
const path = require("path")
const fsPromises = require("fs").promises
const fs = require("fs")

const privateKeyPath = path.join(__dirname, "private-key.pem")
const publicKeyPath = path.join(__dirname, "public-key.pem")

function verifyKeys() {
    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
        console.error("❌ ERROR: No se encontraron las claves privadas y públicas.");
        console.error("🔑 Debes generarlas manualmente antes de iniciar el servidor.");
        console.log("\n📌 Usa los siguientes comandos para generarlas:");
        console.log(`openssl ecparam -genkey -name prime256v1 -noout -out "${privateKeyPath}"`);
        console.log(`openssl ec -in "${privateKeyPath}" -pubout -out "${publicKeyPath}"\n`);
        process.exit(1); 
    }
}
verifyKeys()

const generateToken = async(payload, expiresIn = "1h") => {
    try {
        const privateKey = await fsPromises.readFile(privateKeyPath, "utf-8")
        return jwt.sign(payload, privateKey,{
            algorithm: "ES256",
            expiresIn
        })
    } catch (error) {
        console.error("❌ ERROR al leer la clave privada para firmar el token:", error)
        throw new Error("No se puede generar el token.")
    }
}

const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: "Sesión expirada o no válida." })
    }

    try {
        const publicKey = await fsPromises.readFile(publicKeyPath, "utf-8")

        const decoded = jwt.verify(token, publicKey, { algorithms: ["ES256"] })
        req.user = decoded
        next() 
    } catch (error) {
        console.log("Error al verificar token:", error.message)
        return res.status(401).json({ msg: "Sesión expirada o no válida." })
    }
}


module.exports = {
    verifyToken, generateToken
}