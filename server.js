import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Conexão com o banco de dados MySQL (Atmun)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

let db;

// Função para conectar ao banco
async function connectDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log("✅ Conectado ao banco com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error.message);
  }
}

// Inicializa a conexão com o banco
connectDB();

// 🔄 Rota de teste de conexão
app.get("/api/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS hora");
    res.json({
      status: "online",
      hora: rows[0].hora,
      mensagem: "✅ Banco de dados da Atmun conectado com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro no /api/ping:", error.message);
    res.status(500).json({ status: "erro", detalhe: error.message });
  }
});

// 📋 Listar todos os orçamentos
app.get("/api/orcamentos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orcamentos ORDER BY criado_em DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Erro ao buscar orçamentos:", error.message);
    res.status(500).json({ error: "Erro ao buscar orçamentos" });
  }
});

// ➕ Criar novo orçamento
app.post("/api/orcamentos", async (req, res) => {
  const {
    cliente_nome,
    evento_tipo,
    data_evento,
    local_evento,
    convidados,
    total,
    observacoes,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO orcamentos (cliente_nome, evento_tipo, data_evento, local_evento, convidados, total, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [cliente_nome, evento_tipo, data_evento, local_evento, convidados, total, observacoes]
    );
    res.json({ id: result.insertId, message: "✅ Orçamento criado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao criar orçamento:", error.message);
    res.status(500).json({ error: "Erro ao salvar orçamento" });
  }
});

// 🔄 Revalidar conexão automaticamente se cair
setInterval(async () => {
  try {
    await db.query("SELECT 1");
  } catch {
    console.log("🔁 Reconectando ao banco...");
    connectDB();
  }
}, 30000);

// ✅ Exporta o app (Vercel gerencia o servidor automaticamente)
export default app;
