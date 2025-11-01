import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste do servidor
app.get("/api/ping", (req, res) => {
  res.json({ message: "Servidor funcionando ✅" });
});

// Rota de teste do banco
app.get("/api/test-db", async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });

    const [rows] = await conn.query("SELECT * FROM orcamentos LIMIT 5");
    await conn.end();
    res.json({ success: true, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Porta
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
