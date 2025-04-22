import { NextFunction, Router } from "express"
import { Request, Response } from "express" 
import { verifyToken } from "./Security/JWT"
import { AuthenticatedRequest } from "../AuthenticatedRequest/AuthenticatedRequest";
import { saveBusiness } from "../controllers/business/business.controller";

const businessRouter = Router()

businessRouter.post(
  "/create-business",
  verifyToken,
  (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest<{}, {}, { business_name: string }, {}>;
    const { business_name } = authReq.body
    const user_id = authReq.user_id
    next();
  },
  saveBusiness
);


export default businessRouter