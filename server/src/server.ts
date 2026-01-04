import "reflect-metadata";
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/wompi/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:4321",
      "https://dewayne-polluted-angel.ngrok-free.dev",
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
