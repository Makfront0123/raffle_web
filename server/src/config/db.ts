import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log("✅ Conectado a Aiven correctamente");
  await conn.end();
})();
