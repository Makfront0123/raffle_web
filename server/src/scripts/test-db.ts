 
import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { AppDataSource } from "../data-source";

 

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Aiven conectado correctamente");
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error conectando a Aiven:", error);
    process.exit(1);
  }
})();
