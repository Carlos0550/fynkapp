const clientsRouter = require('express').Router();
const clientsController = require("../controllers/Clients/clients.controller.js")
const { verifyToken } = require("./Security/JWT.js")

clientsRouter.post("/create-client",verifyToken, (req,res,next) => {
    const { 
        client_fullname,
        client_dni,
        client_phone,
        client_address,
        client_email,
        client_city
    } = req.body;

    if(!client_fullname || !client_dni || !client_phone || !client_address || !client_email || !client_city){
        return res.status(400).json({msg: "Todos los campos son obligatorios"})
    }
    
    next()
}, clientsController.createClient)

clientsRouter.get("/get-clients",verifyToken, clientsController.getClients)

clientsRouter.put("/edit-client/:id", (req,res,next) => {
    const { 
        client_fullname,
        client_dni,
        client_phone,
        client_address,
        client_email,
        client_city
    } = req.body;

    if(!client_fullname || !client_dni || !client_phone || !client_address || !client_email || !client_city){
        return res.status(400).json({msg: "Todos los campos son obligatorios"})
    }
    
    next()
}, verifyToken, clientsController.editClient)

module.exports = clientsRouter