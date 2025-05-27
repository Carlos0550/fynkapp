import { RequestHandler, Router } from "express";
import { ValidateSessionRouter } from "./auth.routes";
import { GetMonthlyResume } from "../controllers/MonthlyResume/monthly_resume.controller";

const resumeRouter = Router()

const GetMonthlyResumeRouter: RequestHandler = async (req, res, next): Promise<void> => {
    const { manager_id } = (req as any).manager_data
    if(!manager_id){
        res.status(401).json({msg:"Acceso no autorizado."})
        return
    }
    next()
}

resumeRouter.get("/get-monthly-resume", ValidateSessionRouter, GetMonthlyResumeRouter, GetMonthlyResume)

export default resumeRouter