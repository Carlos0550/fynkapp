const debtsRouter = require("express").Router()

//Controladores
const debtsController = require("../controllers/Debts/debts.controller.js");
const { verifyToken } = require("./Security/JWT.js");

//Multer
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage })

debtsRouter.post("/create-debt", verifyToken, upload.none(), (req, res, next) => {
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

debtsRouter.put("/edit-debt", verifyToken, upload.none(), (req, res, next) => {
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

debtsRouter.delete("/delete-debt", verifyToken, (req, res, next) => {
    const { debtID } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!debtID) {
        return res.status(400).json({ msg: "El ID de la deuda no fue proporcionado." })
    }
    next()
}, debtsController.deleteDebt)

debtsRouter.get("/find-client-for-debts", verifyToken, async (req, res, next) => {
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    next()
}, debtsController.findClientsForDebts)

debtsRouter.post("/cancel-debt", verifyToken, async(req, res, next) => {
    const { clientID } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!clientID) {
        return res.status(400).json({ msg: "El ID del cliente no fue proporcionado." })
    }
    next()
}, debtsController.cancelDebt)

debtsRouter.get("/get-history-client", verifyToken, async (req, res, next) => {
    const user_id = req.user_id
    const { clientID } = req.query
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!clientID) {
        return res.status(400).json({ msg: "El ID del cliente no fue proporcionado." })
    }
    next()
}, debtsController.getHistoryClient)


module.exports = debtsRouter
