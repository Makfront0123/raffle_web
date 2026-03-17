/// <reference path="./types/express.d.ts" />
import "reflect-metadata";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import connectWithRetry from "./config/connectWriteRetry";
import { seedRoles } from "./seeder/rolesSeed";
import { globalLimiter } from "./middleware/limitRequest";
import { automationMiddleware } from "./middleware/automationRunner";
import pingRoutes from "./routes/pingRoutes";
import { PaymentController } from "./controllers/paymentController";
import { PaymentService } from "./services/paymentService";

dotenv.config();

const app = express();

app.use(automationMiddleware)
app.use("/api/ping-automation", pingRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.set("trust proxy", 1);

app.use(cookieParser());
const paymentService = new PaymentService(AppDataSource);
const paymentController = new PaymentController(paymentService);


app.post(
  "/payments/wompi/webhook",
  express.raw({ type: "application/json" }),
  paymentController.wompiWebhook.bind(paymentController)
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:4321",
      "https://dewayne-polluted-angel.ngrok-free.dev",
      "https://raffle-web-git-backup-code-armandos-projects-bf6157fe.vercel.app",
      "https://raffle-web-seven.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],

    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);


const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    const routeName = file.replace(/Routes\.(ts|js)/, "").toLowerCase();
    app.use(`/api/${routeName}`, route.default);
  }
});


const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectWithRetry();
    if (process.env.NODE_ENV === "production") {
      await AppDataSource.runMigrations();
    }
    await seedRoles();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}

startServer();
