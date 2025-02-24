const clientsRouter = require('express').Router();
const clientsController = require("../controllers/Clients/clients.controller.js")
const { verifyToken } = require("./Security/JWT.js")

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

module.exports = clientsRouter