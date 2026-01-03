import "reflect-metadata";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import { PaymentService } from "./services/paymentService";
import { PaymentController } from "./controllers/paymentController";
dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(cookieParser());

const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:4321",
      "https://dewayne-polluted-angel.ngrok-free.dev",
      "https://lobby-spray-officials-suddenly.trycloudflare.com",
      "https://raffle-f925zeu6d-armandos-projects-bf6157fe.vercel.app",
      "https://raffle-web-seven.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));

const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    const routeName = file.replace(/Routes\.(ts|js)/, "").toLowerCase();
    app.use(`/api/${routeName}`, route.default);
  }
});

app.post("/payments/wompi/webhook", (req, res) => {
  return paymentController.wompiWebhook(req, res);
});


const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected (Aiven)");
    if (process.env.NODE_ENV === "production") {
      await AppDataSource.runMigrations();
    }
    await import("./cron/cron");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("ERROR FATAL AL INICIAR EL SERVIDOR:");
    console.error(error);
  }
}

startServer();
