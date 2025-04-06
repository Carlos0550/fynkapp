const clientsRouter = require('express').Router();

//Controladores
const clientsController = require("../controllers/Clients/clients.controller.js")
const deliversController = require("../controllers/Delivers/delivers.controller.js")

//Middlewares y librerias
const { verifyToken } = require("./Security/JWT.js")
const dayjs = require("dayjs")

//Rutas de Clientes
clientsRouter.post("/create-client", verifyToken, (req, res, next) => {
    const {
        client_fullname,
        client_dni,

    } = req.body;

    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }

    if (!client_fullname || !client_dni) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" })
    }

    next()
}, clientsController.createClient)

clientsRouter.get("/get-clients", verifyToken, (req, res, next) => {
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    next()
}, clientsController.getClients)

clientsRouter.put("/edit-client", verifyToken, (req, res, next) => {
    const {
        client_fullname,
        client_dni,
    } = req.body;

    const { clientID } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }

    if (!clientID) {
        return res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." })
    }

    if (!client_fullname || !client_dni) {
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


//Rutas de clientes-entregas
clientsRouter.post("/delivers/create-deliver",verifyToken, (req, res, next) => {
    const { 
        deliver_date, 
        deliver_amount, 
        deliver_client_id,
    } = req.body

    const user_id = req.user_id
    
    if(!user_id){
        return res.status(401).json({msg: "No autorizado, espere unos segundos y vuelva a intentarlo"})
    }

    if(!deliver_client_id ){
        return res.status(400).json({msg: "El servidor no recibio el ID del cliente. Recargue la sección e intente nuevamente"})
    }

    if(!deliver_date || !deliver_amount){
        return res.status(400).json({msg: "Todos los campos son obligatorios"})
    }

    if(!dayjs(deliver_date).isValid()){
        return res.status(400).json({msg: "La fecha no tiene un formato valido"})
    }

    if(isNaN(parseFloat(deliver_amount)) || parseFloat(deliver_amount) <= 0){
        return res.status(400).json({msg: "El monto de entrega debe ser un numero válido"})
    }

    next()
}, deliversController.createDeliver)

clientsRouter.put("/delivers/edit-deliver",verifyToken, (req, res, next) => {
    const { 
        deliver_date, 
        deliver_amount, 
        deliver_id,
    } = req.body

    const user_id = req.user_id

    if(!user_id){
        return res.status(401).json({msg: "No autorizado, espere unos segundos y vuelva a intentarlo"})
    }

    if(!deliver_id){
        return res.status(400).json({msg: "El servidor no recibio el ID de la entrega. Recargue la sección e intente nuevamente"})
    }

    if(!deliver_date || !deliver_amount){
        return res.status(400).json({msg: "Todos los campos son obligatorios"})
    }

    if(!dayjs(deliver_date).isValid()){
        return res.status(400).json({msg: "La fecha no tiene un formato valido"})
    }

    if(isNaN(parseFloat(deliver_amount)) || parseFloat(deliver_amount) <= 0){
        return res.status(400).json({msg: "El monto de entrega debe ser un numero valido"})
    }

    next()
}, deliversController.editDeliver)

clientsRouter.delete("/delivers/delete-deliver",verifyToken, (req, res, next) => {
    const { deliver_id } = req.query
    const user_id = req.user_id
    if (!user_id) {
        return res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
    }
    if (!deliver_id) {
        return res.status(400).json({ msg: "El ID de la entrega no fue proporcionado." })
    }
    next()
}, deliversController.deleteDeliver)

module.exports = clientsRouter