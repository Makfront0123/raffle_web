 
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,       // raffle-web-db-raffle-web.h.aivencloud.com
  user: process.env.DB_USER,       // tu usuario
  password: process.env.DB_PASSWORD, // tu password
  database: process.env.DB_DATABASE, // defaultdb
  port: 12104,
  ssl: { rejectUnauthorized: true } // porque dice ssl-mode=REQUIRED
});

console.log('Database pool created');
