import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.MONGODB_URI) {
  console.log("❌ MONGODB_URI não encontrada no Render/.env");
}

mongoose.set("strictQuery", false);

async function conectarMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });

    console.log("✅ MongoDB conectado!");
  } catch (err) {
    console.log("❌ Erro MongoDB:", err.message);
  }
}

conectarMongoDB();

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

app.get("/health", (req, res) => {
  res.json({
    servidor: "online",
    mongo:
      mongoose.connection.readyState === 1
        ? "conectado"
        : "desconectado"
  });
});

app.get("/teste", async (req, res) => {
  try {
    const teste = new Lead({
      nome: "Gabriel",
      idade: "19",
      pagina: "teste-render"
    });

    await teste.save();

    res.send("✅ Teste salvo no MongoDB!");
  } catch (err) {
    console.log("❌ Erro no teste:", err.message);

    res.status(500).json({
      sucesso: false,
      erro: err.message
    });
  }
});

app.post("/api/questionario", async (req, res) => {
  try {
    console.log("📦 Dados recebidos:", req.body);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        sucesso: false,
        erro: "MongoDB ainda não conectado. Tente novamente em alguns segundos."
      });
    }

    const novoLead = new Lead({
      ...req.body,
      dataEnvio: req.body.dataEnvio || new Date().toISOString()
    });

    await novoLead.save();

    console.log("✅ Lead salvo no MongoDB!");

    res.status(201).json({
      sucesso: true,
      mensagem: "Lead salvo no MongoDB!"
    });

  } catch (err) {
    console.log("❌ Erro ao salvar lead:", err.message);

    res.status(500).json({
      sucesso: false,
      erro: err.message || "Erro ao salvar no MongoDB"
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    erro: "Rota não encontrada"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});