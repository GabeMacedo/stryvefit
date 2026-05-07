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

  const CHAVES_QUESTIONARIO = [
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

  function salvar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
      console.error("Error saving data:", erro);
    }
  }

  function pegar(chave, fallback = "") {
    try {
      const valor = localStorage.getItem(chave);

      if (valor === null || valor === undefined || valor === "") {
        return fallback;
      }

      try {
        return JSON.parse(valor);
      } catch {
        return valor;
      }
    } catch {
      return fallback;
    }
  }

  function irPara(destino) {
    if (!destino) return;
    window.location.href = destino;
  }

  function normalizar(texto) {
    return String(texto || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function valorBotao(botao) {
    return botao.dataset.value || botao.textContent.trim();
  }

  function marcarAtivo(opcoes, valor) {
    if (!opcoes || !opcoes.length) return;

    opcoes.forEach((opcao) => {
      const valorOpcao = valorBotao(opcao);

      if (String(valorOpcao) === String(valor)) {
        opcao.classList.add("ativo");
      } else {
        opcao.classList.remove("ativo");
      }
    });
  }

  function ativarSelecao(opcoes, callback) {
    if (!opcoes || !opcoes.length) return;

    opcoes.forEach((opcao) => {
      opcao.addEventListener("click", () => {
        opcoes.forEach((item) => item.classList.remove("ativo"));
        opcao.classList.add("ativo");

        const valor = valorBotao(opcao);

        if (typeof callback === "function") {
          callback(valor, opcao);
        }
      });
    });
  }

  function limparQuestionario() {
    CHAVES_QUESTIONARIO.forEach((chave) => {
      localStorage.removeItem(chave);
    });
  }

  function mostrarErro(mensagem) {
    alert(mensagem);
  }

  function configurarPaginaIndex() {
    const btnCriarFicha = document.getElementById("btnCriarFicha");

    if (!btnCriarFicha) return;

    btnCriarFicha.addEventListener("click", () => {
      limparQuestionario();
      irPara(ROTAS.index);
    });
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

    if (!btnContinuarFicha) return;

    btnContinuarFicha.addEventListener("click", () => {
      const nomeValor = nome?.value.trim() || "";
      const idadeValor = idade?.value.trim() || "";
      const sexoValor = sexo?.value || "";
      const pesoValor = peso?.value.trim() || "";
      const alturaValor = altura?.value.trim() || "";

      if (!nomeValor || !idadeValor || !sexoValor || !pesoValor || !alturaValor) {
        mostrarErro("Please fill in all fields.");
        return;
      }

      const idadeNumero = Number(idadeValor);
      const pesoNumero = Number(pesoValor);
      const alturaNumero = Number(alturaValor);

      if (!idadeNumero || !pesoNumero || !alturaNumero) {
        mostrarErro("Please enter your age, weight, and height correctly.");
        return;
      }

      if (idadeNumero < 10 || idadeNumero > 100) {
        mostrarErro("Please enter a valid age.");
        return;
      }

      if (pesoNumero < 20 || pesoNumero > 300) {
        mostrarErro("Please enter a valid weight in kg.");
        return;
      }

      if (alturaNumero < 100 || alturaNumero > 250) {
        mostrarErro("Enter your height in centimeters. Example: 175");
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

    if (!btnContinuarObjetivo) return;

    btnContinuarObjetivo.addEventListener("click", () => {
      if (!objetivoSelecionado) {
        mostrarErro("Please select your main goal.");
        return;
      }

      if (!diasSelecionados) {
        mostrarErro("Please select how many days per week you train.");
        return;
      }

      irPara(ROTAS.cobjetivo);
    });
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
        campoDetalhe.style.display = "none";
      }

      if (valorSalvo) {
        marcarAtivo(botoes, valorSalvo);

        if (campoDetalhe) {
          campoDetalhe.style.display = normalizar(valorSalvo) === "sim" ? "block" : "none";
        }
      }

      botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
          const valor = valorBotao(botao);

          botoes.forEach((b) => b.classList.remove("ativo"));
          botao.classList.add("ativo");

          salvar(nomeGrupo, valor);

          if (!campoDetalhe) return;

          if (normalizar(valor) === "sim") {
            campoDetalhe.style.display = "block";
            campoDetalhe.focus();
          } else {
            campoDetalhe.style.display = "none";
            campoDetalhe.value = "";
            salvar(`${nomeGrupo}Detalhe`, "");
          }
        });
      });

      if (campoDetalhe) {
        campoDetalhe.addEventListener("input", () => {
          salvar(`${nomeGrupo}Detalhe`, campoDetalhe.value.trim());
        });
      }
    });

    if (!btnContinuarSaude) return;

    btnContinuarSaude.addEventListener("click", () => {
      const obrigatorios = ["lesao", "dor", "limitacao", "cirurgia"];

      for (const chave of obrigatorios) {
        const resposta = pegar(chave, "");
        const detalhe = pegar(`${chave}Detalhe`, "");

        if (!resposta) {
          mostrarErro("Please answer all health and safety questions.");
          return;
        }

        if (normalizar(resposta) === "sim" && !detalhe) {
          mostrarErro("Please add details for the answers marked as Yes.");
          return;
        }
      }

      irPara(ROTAS.dsaude);
    });
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

    if (!btnContinuarEquipamento) return;

    btnContinuarEquipamento.addEventListener("click", () => {
      if (!localSelecionado) {
        mostrarErro("Please select where you work out.");
        return;
      }

      if (!nivelSelecionado) {
        mostrarErro("Please select your fitness level.");
        return;
      }

      irPara(ROTAS.eequipamento);
    });
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

    if (!btnContinuarAlimentacao) return;

    btnContinuarAlimentacao.addEventListener("click", () => {
      if (!alimentacaoSelecionada) {
        mostrarErro("Please select how your nutrition is right now.");
        return;
      }

      if (!refeicoesSelecionadas) {
        mostrarErro("Please select how many meals you eat per day.");
        return;
      }

      irPara(ROTAS.falimentacao);
    });
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

    if (!btnContinuarEstilo) return;

    btnContinuarEstilo.addEventListener("click", () => {
      if (!sonoSelecionado) {
        mostrarErro("Please select how many hours you sleep.");
        return;
      }

      if (!estresseSelecionado) {
        mostrarErro("Please select your stress level.");
        return;
      }

      if (!rotinaSelecionada) {
        mostrarErro("Please select what your daily routine is like.");
        return;
      }

      irPara(ROTAS.gestilovida);
    });
  }

  const CONFIGURAR_PAGINA = {
    index: configurarPaginaIndex,
    bficha: configurarPaginaFicha,
    cobjetivo: configurarPaginaObjetivo,
    dsaude: configurarPaginaSaude,
    eequipamento: configurarPaginaEquipamento,
    falimentacao: configurarPaginaAlimentacao,
    gestilovida: configurarPaginaEstiloVida
  };

  if (CONFIGURAR_PAGINA[pagina]) {
    CONFIGURAR_PAGINA[pagina]();
  }
});