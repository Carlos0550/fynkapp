const usersRouter = require('express').Router()
import { NextFunction, Request, Response } from "express";
import * as usersController from "../controllers/users/users.controller"
import { verifyToken } from "./Security/JWT"

interface AuthenticatedRequest<
  P = {}, // params
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user_id: string;
}

interface UserValuesInterface {
    user_email: string;
    user_password: string;
    user_name: string;
    user_last_name: string;
}
usersRouter.post("/register-user", 
    (
        req: AuthenticatedRequest<{},{},UserValuesInterface,{}>,
        res: Response,
        next: NextFunction
    ): void => {
    const { user_name, user_last_name, user_email, user_password } = req.body
    if(!user_name || !user_last_name || !user_email || !user_password){
         res.status(400).json({msg: "Todos los campos son obligatorios"})
         return
    }

    next()
}, usersController.registerUser)

usersRouter.post("/login-user", 
    (
        req: AuthenticatedRequest<{},{}, Partial<UserValuesInterface>, {}>,
        res: Response,
        next: NextFunction
    ): void=> {
    const { user_email, user_password } = req.body
    if(!user_email || !user_password){
         res.status(400).json({msg: "Todos los campos son obligatorios"})
         return
    }
    next()
}, usersController.loginUser)

usersRouter.get("/verify-token", verifyToken, (req: any,res: any) => {
    res.status(200).json({
        msg: "Token válido",
        user: req.user
    })
})

export default usersRouter