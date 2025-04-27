import { Router, Request, Response, NextFunction } from "express";
import { getExpirations } from "../controllers/Expirations/expirations.controller";
import { verifyToken } from "./Security/JWT";

const router = Router()

router.get("/get-expirations", verifyToken, (req:Request, res:Response, next:NextFunction) => {
    //Creamos este router porque mas adelante lo vamos a necesitar con la implementacion de las sucursales
    next()
}, getExpirations)

export default router