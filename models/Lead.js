import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    nome: { type: String, trim: true },
    idade: Number,
    peso: Number,
    altura: Number,

    objetivo: { type: String, trim: true },
    diasTreino: Number,

    localTreino: { type: String, trim: true },
    nivelTreino: { type: String, trim: true },

    lesao: { type: String, trim: true },
    lesaoDetalhe: { type: String, trim: true },
    dor: { type: String, trim: true },
    dorDetalhe: { type: String, trim: true },
    limitacao: { type: String, trim: true },
    limitacaoDetalhe: { type: String, trim: true },
    cirurgia: { type: String, trim: true },
    cirurgiaDetalhe: { type: String, trim: true },

    alimentacaoQualidade: { type: String, trim: true },
    dieta: { type: String, trim: true },
    dietaDetalhe: { type: String, trim: true },
    dificuldadePeso: { type: String, trim: true },

    sono: { type: String, trim: true },
    rotina: { type: String, trim: true },
    estresse: { type: String, trim: true },

    origem: { type: String, default: "questionario-site" }
  },
  {
    timestamps: true,
    collection: "leads"
  }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;