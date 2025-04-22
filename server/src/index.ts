// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";

import { verifyDbConnection } from "./database";
import usersRoutes from "./routes/users.routes";
import clientsRoutes from "./routes/clients.routes";
import fastActionsRoutes from "./routes/fastactions.routes";
import debtsRoutes from "./routes/debts.routes";
import * as cronJobs from "./controllers/Cron_Jobs/cron_jobs.controller";
import businessRouter from "./routes/business.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("SERVER ON");
});

verifyDbConnection();

app.use("/users", usersRoutes);
app.use("/clients", clientsRoutes);
app.use("/fast-actions", fastActionsRoutes);
app.use("/debts", debtsRoutes);
app.use("/business", businessRouter)

// Cron Jobs
cron.schedule("0 */30 * * *", cronJobs.updateDebtsStatus);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
