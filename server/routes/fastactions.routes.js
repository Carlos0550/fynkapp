const fastActionsRouter = require("express").Router();
const {  
    retrieveClientData, saveDeliver
} = require("../controllers/fastActions/fastActions.controller.js")
const { verifyToken } = require("./Security/JWT.js")

fastActionsRouter.get("/retrieve-client-data", verifyToken, (req, res, next) => {
    const { client_dni } = req.query
    const {  user_id } = req.user

    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }

    if (!client_dni) {
        return res.status(400).json({ msg: "El DNI del Cliente no fue proporcionado." })
    }
    next()
}, retrieveClientData)

fastActionsRouter.post("/save-deliver", verifyToken, (req, res, next) => {
    const { payment_amount, client_id } = req.query
    const { user_id } = req.user

    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }

    if (!client_id) {
        return res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
    }

    if (!payment_amount) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." })
    }

    if (isNaN(parseFloat(payment_amount)) || parseFloat(payment_amount) <= 0) {
        return res.status(400).json({ msg: "El monto de entrega debe ser un numero valido." })
    }

    next()
}, saveDeliver)


module.exports = fastActionsRouter
