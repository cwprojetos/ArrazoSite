import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Configuração do banco
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ✅ Teste de conexão
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS hora");
    res.json({ status: "online", hora: rows[0].hora });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro de conexão com banco" });
  }
});

// 📋 Obter orçamentos
app.get("/orcamentos", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM orcamentos ORDER BY criado_em DESC");
  res.json(rows);
});

// ➕ Criar novo orçamento
app.post("/orcamentos", async (req, res) => {
  const { cliente_nome, evento_tipo, data_evento, local_evento, convidados, total, observacoes } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO orcamentos (cliente_nome, evento_tipo, data_evento, local_evento, convidados, total, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cliente_nome, evento_tipo, data_evento, local_evento, convidados, total, observacoes]
    );
    res.json({ id: result.insertId, message: "Orçamento criado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar orçamento" });
  }
});

// 🧩 Exporta para Vercel
export default app;
