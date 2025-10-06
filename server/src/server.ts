import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import "reflect-metadata";
import { AppDataSource } from './data-source'; 
import "./utils/cron"; 
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
 

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
