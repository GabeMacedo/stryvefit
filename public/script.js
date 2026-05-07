 document.addEventListener("DOMContentLoaded", () => {
  const pagina = document.body.dataset.pagina || "";

  const ROTAS = {
    index: "bficha.html",
    bficha: "cobjetivo.html",
    cobjetivo: "dsaude.html",
    dsaude: "eequipamento.html",
    eequipamento: "falimentacao.html",
    falimentacao: "gestilovida.html",
    gestilovida: "Oferta-premium-stryvefit-html.html"
  };

  function salvar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  function pegar(chave, fallback = "") {
    const valor = localStorage.getItem(chave);
    if (valor === null) return fallback;

    try {
      return JSON.parse(valor);
    } catch {
      return valor;
    }
  }

  function irPara(destino) {
    if (!destino) return;
    window.location.href = destino;
  }

  function normalizar(texto) {
    return String(texto || "").trim().toLowerCase();
  }

  function marcarAtivo(opcoes, valor) {
    opcoes.forEach((opcao) => {
      const valorOpcao = opcao.dataset.value || opcao.textContent.trim();
      if (String(valorOpcao) === String(valor)) {
        opcao.classList.add("ativo");
      } else {
        opcao.classList.remove("ativo");
      }
    });
  }

  function ativarSelecao(opcoes, callback) {
    opcoes.forEach((opcao) => {
      opcao.addEventListener("click", () => {
        opcoes.forEach((item) => item.classList.remove("ativo"));
        opcao.classList.add("ativo");

        const valor = opcao.dataset.value || opcao.textContent.trim();
        callback(valor, opcao);
      });
    });
  }

  function limparQuestionario() {
    const chaves = [
      "nome",
      "idade",
      "sexo",
      "peso",
      "altura",
      "imc",
      "objetivo",
      "diasTreino",
      "lesao",
      "dor",
      "limitacao",
      "cirurgia",
      "lesaoDetalhe",
      "dorDetalhe",
      "limitacaoDetalhe",
      "cirurgiaDetalhe",
      "localTreino",
      "nivelTreino",
      "alimentacaoAtual",
      "refeicoesDia",
      "sono",
      "estresse",
      "rotina",
      "questionarioEnviado"
    ];

    chaves.forEach((chave) => localStorage.removeItem(chave));
  }

  function configurarPaginaIndex() {
    const btnCriarFicha = document.getElementById("btnCriarFicha");

    if (btnCriarFicha) {
      btnCriarFicha.addEventListener("click", () => {
        limparQuestionario();
        irPara(ROTAS.index);
      });
    }
  }

  function configurarPaginaFicha() {
    const nome = document.getElementById("nome");
    const idade = document.getElementById("idade");
    const sexo = document.getElementById("sexo");
    const peso = document.getElementById("peso");
    const altura = document.getElementById("altura");
    const btnContinuarFicha = document.getElementById("btnContinuarFicha");

    if (nome) nome.value = pegar("nome", "");
    if (idade) idade.value = pegar("idade", "");
    if (sexo) sexo.value = pegar("sexo", "");
    if (peso) peso.value = pegar("peso", "");
    if (altura) altura.value = pegar("altura", "");

    if (btnContinuarFicha) {
      btnContinuarFicha.addEventListener("click", () => {
        const nomeValor = nome?.value.trim() || "";
        const idadeValor = idade?.value.trim() || "";
        const sexoValor = sexo?.value || "";
        const pesoValor = peso?.value.trim() || "";
        const alturaValor = altura?.value.trim() || "";

        if (!nomeValor || !idadeValor || !sexoValor || !pesoValor || !alturaValor) {
          alert("Preencha todos os campos.");
          return;
        }

        const idadeNumero = Number(idadeValor);
        const pesoNumero = Number(pesoValor);
        const alturaNumero = Number(alturaValor);

        if (!idadeNumero || !pesoNumero || !alturaNumero) {
          alert("Preencha idade, peso e altura corretamente.");
          return;
        }

        if (alturaNumero < 100 || alturaNumero > 250) {
          alert("Digite a altura em centímetros. Exemplo: 175");
          return;
        }

        const alturaM = alturaNumero / 100;
        const imc = (pesoNumero / (alturaM * alturaM)).toFixed(1);

        salvar("nome", nomeValor);
        salvar("idade", idadeValor);
        salvar("sexo", sexoValor);
        salvar("peso", pesoValor);
        salvar("altura", alturaValor);
        salvar("imc", imc);

        irPara(ROTAS.bficha);
      });
    }
  }

  function configurarPaginaObjetivo() {
    let objetivoSelecionado = pegar("objetivo", "");
    let diasSelecionados = pegar("diasTreino", "");

    const objetivoOpcoes = document.querySelectorAll("#objetivoOpcoes button");
    const diasOpcoes = document.querySelectorAll("#diasOpcoes button");
    const btnContinuarObjetivo = document.getElementById("btnContinuarObjetivo");

    if (objetivoSelecionado) marcarAtivo(objetivoOpcoes, objetivoSelecionado);
    if (diasSelecionados) marcarAtivo(diasOpcoes, diasSelecionados);

    ativarSelecao(objetivoOpcoes, (valor) => {
      objetivoSelecionado = valor;
      salvar("objetivo", valor);
    });

    ativarSelecao(diasOpcoes, (valor) => {
      diasSelecionados = valor;
      salvar("diasTreino", valor);
    });

    if (btnContinuarObjetivo) {
      btnContinuarObjetivo.addEventListener("click", () => {
        if (!objetivoSelecionado) {
          alert("Selecione seu objetivo.");
          return;
        }

        if (!diasSelecionados) {
          alert("Selecione quantos dias você treina.");
          return;
        }

        irPara(ROTAS.cobjetivo);
      });
    }
  }

  function configurarPaginaSaude() {
    const gruposSaude = document.querySelectorAll(".opcoes-saude");
    const btnContinuarSaude = document.getElementById("btnContinuarSaude");

    gruposSaude.forEach((grupo) => {
      const nomeGrupo = grupo.dataset.grupo;
      const botoes = grupo.querySelectorAll("button");
      const campoDetalhe = document.getElementById(`campo-${nomeGrupo}`);

      const valorSalvo = pegar(nomeGrupo, "");
      const detalheSalvo = pegar(`${nomeGrupo}Detalhe`, "");

      if (campoDetalhe) {
        campoDetalhe.value = detalheSalvo;
      }

      if (valorSalvo) {
        marcarAtivo(botoes, valorSalvo);

        if (campoDetalhe) {
          campoDetalhe.style.display = normalizar(valorSalvo) === "sim" ? "block" : "none";
        }
      }

      botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
          const valor = botao.dataset.value || botao.textContent.trim();

          botoes.forEach((b) => b.classList.remove("ativo"));
          botao.classList.add("ativo");

          salvar(nomeGrupo, valor);

          if (campoDetalhe) {
            if (normalizar(valor) === "sim") {
              campoDetalhe.style.display = "block";
            } else {
              campoDetalhe.style.display = "none";
              campoDetalhe.value = "";
              salvar(`${nomeGrupo}Detalhe`, "");
            }
          }
        });
      });

      if (campoDetalhe) {
        campoDetalhe.addEventListener("input", () => {
          salvar(`${nomeGrupo}Detalhe`, campoDetalhe.value.trim());
        });
      }
    });

    if (btnContinuarSaude) {
      btnContinuarSaude.addEventListener("click", () => {
        const obrigatorios = ["lesao", "dor", "limitacao", "cirurgia"];

        for (const chave of obrigatorios) {
          const resposta = pegar(chave, "");
          const detalhe = pegar(`${chave}Detalhe`, "");

          if (!resposta) {
            alert("Responda todas as perguntas de saúde.");
            return;
          }

          if (normalizar(resposta) === "sim" && !detalhe) {
            alert("Preencha o detalhe das respostas marcadas como Sim.");
            return;
          }
        }

        irPara(ROTAS.dsaude);
      });
    }
  }

  function configurarPaginaEquipamento() {
    let localSelecionado = pegar("localTreino", "");
    let nivelSelecionado = pegar("nivelTreino", "");

    const localOpcoes = document.querySelectorAll("#localTreinoOpcoes button");
    const nivelOpcoes = document.querySelectorAll("#nivelTreinoOpcoes button");
    const btnContinuarEquipamento = document.getElementById("btnContinuarEquipamento");

    if (localSelecionado) marcarAtivo(localOpcoes, localSelecionado);
    if (nivelSelecionado) marcarAtivo(nivelOpcoes, nivelSelecionado);

    ativarSelecao(localOpcoes, (valor) => {
      localSelecionado = valor;
      salvar("localTreino", valor);
    });

    ativarSelecao(nivelOpcoes, (valor) => {
      nivelSelecionado = valor;
      salvar("nivelTreino", valor);
    });

    if (btnContinuarEquipamento) {
      btnContinuarEquipamento.addEventListener("click", () => {
        if (!localSelecionado) {
          alert("Selecione onde você treina.");
          return;
        }

        if (!nivelSelecionado) {
          alert("Selecione seu nível.");
          return;
        }

        irPara(ROTAS.eequipamento);
      });
    }
  }

  function configurarPaginaAlimentacao() {
    let alimentacaoSelecionada = pegar("alimentacaoAtual", "");
    let refeicoesSelecionadas = pegar("refeicoesDia", "");

    const alimentacaoOpcoes = document.querySelectorAll("#alimentacaoOpcoes button");
    const refeicoesOpcoes = document.querySelectorAll("#refeicoesOpcoes button");
    const btnContinuarAlimentacao = document.getElementById("btnContinuarAlimentacao");

    if (alimentacaoSelecionada) marcarAtivo(alimentacaoOpcoes, alimentacaoSelecionada);
    if (refeicoesSelecionadas) marcarAtivo(refeicoesOpcoes, refeicoesSelecionadas);

    ativarSelecao(alimentacaoOpcoes, (valor) => {
      alimentacaoSelecionada = valor;
      salvar("alimentacaoAtual", valor);
    });

    ativarSelecao(refeicoesOpcoes, (valor) => {
      refeicoesSelecionadas = valor;
      salvar("refeicoesDia", valor);
    });

    if (btnContinuarAlimentacao) {
      btnContinuarAlimentacao.addEventListener("click", () => {
        if (!alimentacaoSelecionada) {
          alert("Selecione como está sua alimentação.");
          return;
        }

        if (!refeicoesSelecionadas) {
          alert("Selecione quantas refeições você faz por dia.");
          return;
        }

        irPara(ROTAS.falimentacao);
      });
    }
  }

  function configurarPaginaEstiloVida() {
    let sonoSelecionado = pegar("sono", "");
    let estresseSelecionado = pegar("estresse", "");
    let rotinaSelecionada = pegar("rotina", "");

    const sonoOpcoes = document.querySelectorAll("#horasSonoOpcoes button");
    const estresseOpcoes = document.querySelectorAll("#estresseOpcoes button");
    const rotinaOpcoes = document.querySelectorAll("#rotinaOpcoes button");
    const btnContinuarEstilo = document.getElementById("btnContinuarEstilo");

    if (sonoSelecionado) marcarAtivo(sonoOpcoes, sonoSelecionado);
    if (estresseSelecionado) marcarAtivo(estresseOpcoes, estresseSelecionado);
    if (rotinaSelecionada) marcarAtivo(rotinaOpcoes, rotinaSelecionada);

    ativarSelecao(sonoOpcoes, (valor) => {
      sonoSelecionado = valor;
      salvar("sono", valor);
    });

    ativarSelecao(estresseOpcoes, (valor) => {
      estresseSelecionado = valor;
      salvar("estresse", valor);
    });

    ativarSelecao(rotinaOpcoes, (valor) => {
      rotinaSelecionada = valor;
      salvar("rotina", valor);
    });

    if (btnContinuarEstilo) {
      btnContinuarEstilo.addEventListener("click", () => {
        if (!sonoSelecionado) {
          alert("Selecione quantas horas você dorme.");
          return;
        }

        if (!estresseSelecionado) {
          alert("Selecione seu nível de estresse.");
          return;
        }

        if (!rotinaSelecionada) {
          alert("Selecione como é sua rotina.");
          return;
        }

        irPara(ROTAS.gestilovida);
      });
    }
  }

  if (pagina === "index") configurarPaginaIndex();
  if (pagina === "bficha") configurarPaginaFicha();
  if (pagina === "cobjetivo") configurarPaginaObjetivo();
  if (pagina === "dsaude") configurarPaginaSaude();
  if (pagina === "eequipamento") configurarPaginaEquipamento();
  if (pagina === "falimentacao") configurarPaginaAlimentacao();
  if (pagina === "gestilovida") configurarPaginaEstiloVida();
});