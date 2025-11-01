import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,      // Ex: 51.222.153.46
  user: process.env.DB_USER,      // Ex: cwprojet_financeiro
  password: process.env.DB_PASS,  // Sua senha do painel Atmun
  database: process.env.DB_NAME,  // Ex: cwprojet_Arrazo_Eventos
});

console.log("✅ Conectado ao banco com sucesso! Hora atual:", new Date());
