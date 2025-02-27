const clientsRouter = require('express').Router();
const clientsController = require("../controllers/Clients/clients.controller.js")
const debtsController = require("../controllers/Debts/debts.controller.js")
const { verifyToken } = require("./Security/JWT.js")

const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage })

clientsRouter.post("/create-client", verifyToken, (req, res, next) => {
    const {
        client_fullname,
        client_dni,
        client_phone,
        client_address,
        client_email,
        client_city
    } = req.body;

    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }

    if (!client_fullname || !client_dni || !client_phone || !client_address || !client_email || !client_city) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" })
    }

    next()
}, clientsController.createClient)

clientsRouter.get("/get-clients", verifyToken, (req, res, next) => {
    const user_id = req.user_id
    console.log(user_id)
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    next()
}, clientsController.getClients)

clientsRouter.put("/edit-client", verifyToken, (req, res, next) => {
    const {
        client_fullname,
        client_dni,
        client_phone,
        client_address,
        client_email,
        client_city
    } = req.body;

    const { clientID } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }

    if (!clientID) {
        return res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
    }

    if (!client_fullname || !client_dni || !client_phone || !client_address || !client_email || !client_city) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" })
    }

    next()
}, clientsController.editClient)

clientsRouter.delete("/delete-client", verifyToken, (req, res, next) => {
    const { clientID } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!clientID) {
        return res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
    }

    next()
}, clientsController.deleteClient)

clientsRouter.get("/get-client-data", verifyToken, (req, res, next) => {
    const { clientID } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!clientID) {
        return res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
    }
    next()
}, clientsController.getClientData)

clientsRouter.get("/get-client-financial-data", verifyToken, (req, res, next) => {
    const user_id = req.user_id
    const { client_id } = req.query

    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!client_id) {
        return res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
    }
    next()
}, clientsController.getClientFinancialData)

clientsRouter.post("/debts/create-debt", verifyToken, upload.none(), (req, res, next) => {
    const { debt_date, debt_products, client_id } = req.body;

    if (!debt_date || !debt_products || !client_id) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    if (isNaN(Date.parse(debt_date))) {
        return res.status(400).json({ msg: "La fecha no tiene un formato válido (YYYY-MM-DD)." });
    }

    try {
        const parsedProducts = JSON.parse(debt_products);
        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
            return res.status(400).json({ msg: "El campo 'debt_products' debe ser un array JSON no vacío." });
        }
    } catch (error) {
        return res.status(400).json({ msg: "El campo 'debt_products' no es un JSON válido." });
    }

    const user_id = req.user_id;
    if (!user_id) {
        return res.status(401).json({ msg: "Acceso no autorizado. No se proporcionó un ID de usuario válido." });
    }

    next();
}, debtsController.createDebt);

clientsRouter.put("/debts/edit-debt", verifyToken, upload.none(), (req, res, next) => {
    const { debt_date, debt_products } = req.body;
    const { debtID } = req.query;
    if (!debt_date || !debt_products) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    if (isNaN(Date.parse(debt_date))) {
        return res.status(400).json({ msg: "La fecha no tiene un formato válido (YYYY-MM-DD)." });
    }

    try {
        const parsedProducts = JSON.parse(debt_products);
        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
            return res.status(400).json({ msg: "El campo 'debt_products' debe ser un array JSON no vacío." });
        }
    } catch (error) {
        return res.status(400).json({ msg: "El campo 'debt_products' no es un JSON válido." });
    }

    if (!debtID) {
        return res.status(400).json({ msg: "El ID de la deuda no fue proporcionado." });
    }

    next();
}, debtsController.editDebt)


module.exports = clientsRouter