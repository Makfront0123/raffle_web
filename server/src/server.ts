import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import "reflect-metadata";
import { AppDataSource } from './data-source';
import helmet from 'helmet';
import "./utils/cron";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:4321"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// 👇 Manejo manual de preflight (sin path-to-regexp)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    return res.sendStatus(204);
  }
  next();
});



app.use(helmet());


const routesPath = path.join(__dirname, 'routes');

// server.ts
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    const routeName = file.replace(/Routes\.(ts|js)/, '').toLowerCase();
    app.use(`/api/${routeName}`, route.default); // no authMiddleware global
  }
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // ✅ Inicializar TypeORM
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
}

startServer();
