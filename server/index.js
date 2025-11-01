import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ rota de teste simples
app.get("/api/ping", (req, res) => {
  res.json({ message: "Servidor funcionando ✅" });
});

// ✅ define porta
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
