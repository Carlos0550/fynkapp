import express, { Response } from "express";
import cors from "cors";

import "dotenv/config"
import { startBot } from "./bot";
import WAReminder from "./routes/reminders.routes";

const app = express();
app.use(express.json());


app.use(cors({
  origin: [
    "https://api.fynkapp.com.ar",
    "http://localhost:5000"
  ]
}));

// const testRedisConnection = async () => {
//   try {
//     await redis.set("test_key", "Redis andando....", "EX", 5);
//     const valor = await redis.get("test_key");
//     console.log("✅ Valor desde Redis:", valor);
//   } catch (error) {
//     console.log("❌ Error al iniciar la conexión a Redis:", error);
//   }
// };

//testRedisConnection();
startBot()

app.get("/", (_,res: Response) => {
    res.send("Bot server on")
    return;
});

app.use("/wa-notifications", WAReminder)


app.listen(5005, () => {
  console.log(`🚀 Servidor de notificaciones escuchando en el puerto ${5001}`);
});