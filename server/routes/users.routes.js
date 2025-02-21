const usersRouter = require('express').Router()
const usersController = require("../controllers/users/users.controller.js")
const { verifyToken } = require("./Security/JWT.js")

usersRouter.post("/register-user", (req,res,next) => {
    const { user_name, user_last_name, user_email, user_password } = req.body
    console.log(user_name, user_last_name, user_email, user_password )
    if(!user_name || !user_last_name || !user_email || !user_password){
        return res.status(400).json({msg: "Todos los campos son obligatorios"})
    }

    next()
}, usersController.registerUser)

usersRouter.post("/login-user", (req,res,next) => {
    const { user_email, user_password } = req.body
    if(!user_email || !user_password){
        return res.status(400).json({msg: "Todos los campos son obligatorios"})
    }
    next()
}, usersController.loginUser)

usersRouter.get("/verify-token", verifyToken, (req,res) => {
    res.status(200).json({
        msg: "Token válido",
        user: req.user
    })
})

module.exports = usersRouter