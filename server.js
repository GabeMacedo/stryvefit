import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB conectado!");
  })
  .catch((err) => {
    console.log("❌ Erro MongoDB:", err.message);
  });

const leadSchema = new mongoose.Schema({
  nome: String,
  idade: String,
  sexo: String,
  peso: String,
  altura: String,
  imc: String,
  objetivo: String,
  diasTreino: String,

  lesao: String,
  lesaoDetalhe: String,
  dor: String,
  dorDetalhe: String,
  limitacao: String,
  limitacaoDetalhe: String,
  cirurgia: String,
  cirurgiaDetalhe: String,

  localTreino: String,
  nivelTreino: String,

  alimentacaoAtual: String,
  refeicoesDia: String,
  sono: String,
  estresse: String,
  rotina: String,

  pagina: String,
  dataEnvio: String
}, {
  timestamps: true
});

const Lead = mongoose.model("Lead", leadSchema);

app.get("/", (req, res) => {
  res.send("✅ Servidor STRYVEFIT online!");
});

app.get("/teste", async (req, res) => {
  try {
    const teste = new Lead({
      nome: "Gabriel",
      idade: "19",
      pagina: "teste"
    });

    await teste.save();

    res.send("✅ Teste salvo no MongoDB!");
  } catch (err) {
    console.log("❌ Erro no teste:", err);
    res.status(500).send("❌ Erro ao salvar teste");
  }
});

app.post("/api/questionario", async (req, res) => {
  try {
    console.log("📦 Dados recebidos:", req.body);

    const novoLead = new Lead(req.body);

    await novoLead.save();

    console.log("✅ Lead salvo no MongoDB!");

    res.status(201).json({
      sucesso: true,
      mensagem: "Lead salvo no MongoDB!"
    });

  } catch (err) {
    console.log("❌ Erro ao salvar lead:", err);

    res.status(500).json({
      sucesso: false,
      erro: err.message || "Erro ao salvar no MongoDB"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});