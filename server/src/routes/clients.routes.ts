// src/routes/clients.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import * as clientsController from "../controllers/Clients/clients.controller";
import * as deliversController from "../controllers/Delivers/delivers.controller";
import { verifyToken } from "./Security/JWT";
import dayjs from "dayjs";

const clientsRouter = Router();

function requireUserId(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user_id) {
    res.status(401).json({ msg: "El servidor no recibió su ID de administrador." });
    return;
  }
  next();
}


// Rutas de Clientes
clientsRouter.post("/create-client", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { client_fullname } = req.body;
  if (!client_fullname) {
    res.status(400).json({ msg: "El servidor no recibió el nombre del cliente." });
    return
  }
  next();
}, clientsController.createClient);

clientsRouter.get("/get-clients", verifyToken, requireUserId, clientsController.getClients);

clientsRouter.put("/edit-client", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { client_fullname, client_dni } = req.body;
  const { clientID } = req.query;
  if (!clientID) {
    res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." });
    return
  }
  if (!client_fullname ) {
    res.status(400).json({ msg: "El servidor no recibió el nombre del cliente." });
    return
  }
  next();
}, clientsController.editClient);

clientsRouter.delete("/delete-client", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { clientID } = req.query;
  if (!clientID) {
    res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." });
    return
  }
  next();
}, clientsController.deleteClient);

clientsRouter.get("/get-client-data", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { clientID } = req.query;
  if (!clientID) {
    res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." });
    return
  }
  next();
}, clientsController.getClientData);

clientsRouter.get("/get-client-financial-data", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { client_id } = req.query;
  if (!client_id) {
    res.status(400).json({ msg: "El ID del Cliente no fue proporcionado." });
    return
  }
  next();
}, clientsController.getClientFinancialData);

// Rutas de clientes-entregas
clientsRouter.post("/delivers/create-deliver", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { deliver_date, deliver_amount, deliver_client_id } = req.body;

  if (!deliver_client_id) {
    res.status(400).json({ msg: "El servidor no recibió el ID del cliente." });
    return
  }
  if (!deliver_date || !deliver_amount) {
    res.status(400).json({ msg: "Todos los campos son obligatorios" });
    return
  }
  if (!dayjs(deliver_date).isValid()) {
    res.status(400).json({ msg: "La fecha no tiene un formato válido" });
    return
  }
  if (isNaN(parseFloat(deliver_amount)) || parseFloat(deliver_amount) <= 0) {
    res.status(400).json({ msg: "El monto de entrega debe ser un número válido" });
    return
  }
  next();
}, deliversController.createDeliver);

clientsRouter.put("/delivers/edit-deliver", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { deliver_date, deliver_amount, deliver_id } = req.body;
  if (!deliver_id) {
    res.status(400).json({ msg: "El ID de la entrega no fue proporcionado." });
    return
  }
  if (!deliver_date || !deliver_amount) {
    res.status(400).json({ msg: "Todos los campos son obligatorios" });
    return
  }
  if (!dayjs(deliver_date).isValid()) {
    res.status(400).json({ msg: "La fecha no tiene un formato válido" });
    return
  }
  if (isNaN(parseFloat(deliver_amount)) || parseFloat(deliver_amount) <= 0) {
    res.status(400).json({ msg: "El monto de entrega debe ser un número válido" });
    return
  }
  next();
}, deliversController.editDeliver);

clientsRouter.delete("/delivers/delete-deliver", verifyToken, requireUserId, (req: Request, res: Response, next: NextFunction) => {
  const { deliver_id } = req.query;
  if (!deliver_id) {
    res.status(400).json({ msg: "El ID de la entrega no fue proporcionado." });
    return
  }
  next();
}, deliversController.deleteDeliver);

export default clientsRouter;
