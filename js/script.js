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

  // mesAtual (1-12): o 13º conta os meses trabalhados no ano civil, não o
  // tempo de casa — a estimativa supõe saída no mês atual.
  function calcularVerbas(salario, meses, tipo, mesAtual) {
    if (tipo === "justa_causa") {
      return {
        valor: null,
        detalhe: "Na demissão por justa causa, a legislação prevê em regra apenas o saldo de salário dos dias trabalhados no mês da saída e as férias vencidas, se houver — as verbas proporcionais não são devidas nessa modalidade."
      };
    }

    var decimoTerceiro = salario * Math.min(meses, mesAtual) / 12;
    // Férias proporcionais: meses desde o último aniversário do contrato, + 1/3
    var feriasProporcionais = salario * (meses % 12) / 12 * (4 / 3);
    var total = decimoTerceiro + feriasProporcionais;

    if (tipo === "pedido_demissao") {
      return {
        valor: total,
        detalhe: "13º proporcional + férias proporcionais com 1/3. No pedido de demissão não há aviso prévio indenizado, e o FGTS fica retido na conta (sem saque e sem multa de 40%)"
      };
    }

    // Lei 12.506/2011: 30 dias + 3 por ano completo de casa, até 90 dias
    var diasAviso = 30 + 3 * Math.min(20, Math.floor(meses / 12));
    var avisoPrevio = salario * diasAviso / 30;
    var fgtsAcumulado = salario * 0.08 * meses;
    var multaFgts = fgtsAcumulado * 0.4;
    total += avisoPrevio + fgtsAcumulado + multaFgts;
    return {
      valor: total,
      detalhe: "aviso prévio de " + diasAviso + " dias + 13º proporcional + férias proporcionais com 1/3 + saque do FGTS acumulado (8% ao mês) + multa de 40% sobre o FGTS"
    };
  }

  var calcForm = document.getElementById("calc-form");
  if (calcForm) {
    calcForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var salario = parseFloat(document.getElementById("salario").value) || 0;
      var meses = parseInt(document.getElementById("meses").value, 10) || 0;
      var tipo = document.getElementById("tipo").value;

      var resultado = calcularVerbas(salario, meses, tipo, new Date().getMonth() + 1);
      var resultBox = document.getElementById("calc-result");
      var resultValue = document.getElementById("calc-value");
      var resultDisclaimer = resultBox.querySelector(".calc-disclaimer");

      if (resultado.valor === null) {
        resultValue.textContent = "Não estimável nesta modalidade";
        resultDisclaimer.textContent = resultado.detalhe;
      } else {
        resultValue.textContent = fmtBRL.format(resultado.valor);
        resultDisclaimer.textContent =
          "Estimativa educativa (" + resultado.detalhe + "), supondo saída neste mês — não considera " +
          "saldo de salário, férias vencidas, acordos coletivos, adicionais ou médias de horas extras. " +
          "Fale com um advogado para uma análise do seu caso.";
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
