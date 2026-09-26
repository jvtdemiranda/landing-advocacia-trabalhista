(function () {
  "use strict";

  var WHATS_NUMBER = "5591988880000"; // fictício — projeto de portfólio

  // ---- menu mobile ----
  var toggle = document.getElementById("nav-toggle");
  var mnav = document.getElementById("mnav");
  if (toggle && mnav) {
    toggle.addEventListener("click", function () {
      var open = mnav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mnav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mnav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------------------------------------------------------------
  // Calculadora de verbas rescisórias — estimativa educativa.
  //
  // Importante (Provimento 205/2021 da OAB): isso não é uma
  // "calculadora de quanto você vai ganhar" no estilo comercial — é
  // conteúdo informativo sobre como a lei calcula essas verbas, com
  // disclaimer explícito de que não substitui análise profissional.
  // A diferença de enquadramento importa tanto quanto o código.
  // ---------------------------------------------------------------
  var fmtBRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function calcularVerbas(salario, meses, tipo) {
    var fracaoAno = (meses % 12) / 12;
    var fgtsAcumulado = salario * 0.08 * meses;

    if (tipo === "justa_causa") {
      return {
        valor: null,
        detalhe: "Na demissão por justa causa, a legislação prevê em regra apenas o saldo de salário dos dias trabalhados no mês da saída — a maior parte das verbas proporcionais não é devida nessa modalidade."
      };
    }

    var decimoTerceiro = salario * fracaoAno;
    var feriasProporcionais = salario * fracaoAno * (4 / 3);
    var total = decimoTerceiro + feriasProporcionais + fgtsAcumulado;
    var detalhe = "13º proporcional + férias proporcionais + FGTS acumulado (8% ao mês)";

    if (tipo === "sem_justa_causa") {
      var avisoPrevio = salario;
      var multaFgts = fgtsAcumulado * 0.4;
      total += avisoPrevio + multaFgts;
      detalhe = "aviso prévio + 13º proporcional + férias proporcionais + FGTS acumulado + multa de 40% sobre o FGTS";
    }

    return { valor: total, detalhe: detalhe };
  }

  var calcForm = document.getElementById("calc-form");
  if (calcForm) {
    calcForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var salario = parseFloat(document.getElementById("salario").value) || 0;
      var meses = parseInt(document.getElementById("meses").value, 10) || 0;
      var tipo = document.getElementById("tipo").value;

      var resultado = calcularVerbas(salario, meses, tipo);
      var resultBox = document.getElementById("calc-result");
      var resultValue = document.getElementById("calc-value");
      var resultDisclaimer = resultBox.querySelector(".calc-disclaimer");

      if (resultado.valor === null) {
        resultValue.textContent = "Não estimável nesta modalidade";
        resultDisclaimer.textContent = resultado.detalhe;
      } else {
        resultValue.textContent = fmtBRL.format(resultado.valor);
        resultDisclaimer.textContent =
          "Estimativa educativa (" + resultado.detalhe + ") — não considera acordos coletivos, " +
          "adicionais ou médias de horas extras. Fale com um advogado para uma análise do seu caso.";
      }
      resultBox.hidden = false;
    });
  }

  // ---------------------------------------------------------------
  // Contato — mensagem institucional pro WhatsApp, sem linguagem de
  // captação ("responda já!", "não perca essa oportunidade" etc.).
  // ---------------------------------------------------------------
  var contatoForm = document.getElementById("contato-form");
  if (contatoForm) {
    contatoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = document.getElementById("nome").value.trim();
      var assunto = document.getElementById("assunto").value;
      var mensagem = "Olá, meu nome é " + nome + ". Gostaria de agendar uma conversa sobre: " + assunto + ".";
      var link = "https://wa.me/" + WHATS_NUMBER + "?text=" + encodeURIComponent(mensagem);
      window.open(link, "_blank", "noopener");
    });
  }
})();
