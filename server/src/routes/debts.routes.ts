const debtsRouter = require("express").Router()

import { NextFunction, Request, Response } from "express";
//Controladores
import * as debtsController from "../controllers/Debts/debts.controller"
import { verifyToken } from "./Security/JWT";

//Multer
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage })

interface DebtProductsInterface{
    product_name: string,
    product_price: number,
    product_quantity: number
}
interface DebtInterface{
    debt_products: string,
    debt_date: string,
    client_id: string
}

interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user_id: string;
}

debtsRouter.post("/create-debt", verifyToken, upload.none(), (req:AuthenticatedRequest<DebtInterface>, res:Response, next:NextFunction): void => {
    const { debt_date, debt_products, client_id } = req.body;

    if (!debt_date || !debt_products || !client_id) {
         res.status(400).json({ msg: "Todos los campos son obligatorios." });
         return
    }

    if (isNaN(Date.parse(debt_date))) {
         res.status(400).json({ msg: "La fecha no tiene un formato válido (YYYY-MM-DD)." });
         return
    }

    try {
        const parsedProducts: DebtProductsInterface[] = JSON.parse(debt_products);
        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
             res.status(400).json({ msg: "El campo 'debt_products' debe ser un array JSON no vacío." });
             return
        }
    } catch (error) {
         res.status(400).json({ msg: "El campo 'debt_products' no es un JSON válido." });
         return
    }

    const user_id = req.user_id;
    if (!user_id) {
         res.status(401).json({ msg: "Acceso no autorizado. No se proporcionó un ID de usuario válido." });
         return
    }

    next();
}, debtsController.createDebt);

interface EditDebtBody {
    debt_date: string;
    debt_products: string; 
}
  
interface EditDebtQuery {
    debtID: string;
}

debtsRouter.put("/edit-debt",
    verifyToken,
    upload.none(),(
      req: AuthenticatedRequest<{}, {}, EditDebtBody, EditDebtQuery>,
      res: Response,
      next: NextFunction
    ): void => {
      const { debt_date, debt_products } = req.body;
      const { debtID } = req.query;
  
      if (!debt_date || !debt_products) {
        res.status(400).json({ msg: "Todos los campos son obligatorios." });
        return;
      }
  
      if (isNaN(Date.parse(debt_date))) {
        res.status(400).json({ msg: "La fecha no tiene un formato válido (YYYY-MM-DD)." });
        return;
      }
  
      try {
        const parsedProducts: DebtProductsInterface[] = JSON.parse(debt_products);
        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
          res.status(400).json({ msg: "El campo 'debt_products' debe ser un array JSON no vacío." });
          return;
        }
      } catch (error) {
        res.status(400).json({ msg: "El campo 'debt_products' no es un JSON válido." });
        return;
      }
  
      if (!debtID) {
        res.status(400).json({ msg: "El ID de la deuda no fue proporcionado." });
        return;
      }
  
      next();
    },
    debtsController.editDebt
  );
  

debtsRouter.delete("/delete-debt", verifyToken, 
    (
        req:AuthenticatedRequest<{},{},{}, {debtID: string}>, 
        res:Response, 
        next:NextFunction
    ): void => {
    const { debtID } = req.query
    const user_id = req.user_id
    if (!user_id) {
         res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
         return
    }
    if (!debtID) {
         res.status(400).json({ msg: "El ID de la deuda no fue proporcionado." })
         return
    }
    next()
}, debtsController.deleteDebt)

debtsRouter.get("/find-client-for-debts", 
    verifyToken, 
    (req:AuthenticatedRequest<{},{},{},{}>, res:Response, next: NextFunction): void => {
    const user_id = req.user_id
    if (!user_id) {
         res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
         return
    }
    next()
}, debtsController.findClientsForDebts)

debtsRouter.post("/cancel-debt", verifyToken, 
    (
        req: AuthenticatedRequest<{},{},{},{clientID: string}>, 
        res: Response, 
        next: NextFunction
    ): void => {
    const { clientID } = req.query
    const user_id = req.user_id
    if (!user_id) {
         res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
         return
    }
    if (!clientID) {
         res.status(400).json({ msg: "El ID del cliente no fue proporcionado." })
         return
    }
    next()
}, debtsController.cancelDebt)

debtsRouter.get("/get-history-client", verifyToken,
    (
        req: AuthenticatedRequest<{},{},{},{clientID: string, history_id: string}>, 
        res: Response, 
        next: NextFunction
    ): void => {
    const user_id = req.user_id
    const { clientID, history_id } = req.query
    if (!user_id) {
         res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
         return
    }

    if(!history_id) {
        res.status(400).json({msg: "El servidor no recibió el ID de historial, espere unos segundos e intente nuevamente."})
        return
    } 

    if (!clientID) {
         res.status(400).json({ msg: "El ID del cliente no fue proporcionado." })
         return
    }
    next()
}, debtsController.getHistoryClient)

debtsRouter.get("/get-history-registry", verifyToken,
    (
        req:AuthenticatedRequest<{},{},{},{clientID: string}>, 
        res:Response, 
        next:NextFunction
    ): void => {
    const user_id = req.user_id
    const { clientID } = req.query
    if (!user_id) {
         res.status(401).json({ msg: "EL servidor no recibio su ID de administrador, espere unos segundos y vuelva a intentarlo." })
         return
    }

    if (!clientID) {
         res.status(400).json({ msg: "El ID del cliente no fue proporcionado." })
         return
    }
    next()
}, debtsController.getHistoryRegistry)


export default debtsRouter
