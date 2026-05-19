 
 function registrar() {
   

   let nome = document.getElementById("nome").value;
   let pressao = document.getElementById("pressao").value;
   let batimentos = document.getElementById("batimentos").value;
   let respiracao = document.getElementById("respiracao").value;
  

 if (
  nome.trim() === "" ||
  pressao.trim() === "" ||
  batimentos.trim() === "" ||
  respiracao.trim() === ""

) { alert("Preencha tudo!");
  return;
}

  let agora = new Date();
  let dataHora = agora.toLocaleString();
  let id = Date.now();

  adicionarNaTabela(id,dataHora,nome, pressao, batimentos,respiracao);
  salvar(id,dataHora,nome, pressao, batimentos, respiracao);

  document.getElementById("nome").value = "";
  document.getElementById("pressao").value = "";
  document.getElementById("batimentos").value = "";
  document.getElementById("respiracao").value = "";
}

function classificarPressao(pressao) {

  if (!pressao || !pressao.includes("/")) {
    return "normal";
  }

  let partes = pressao.split("/");
  let sistolica = parseInt(partes[0]);

  if (isNaN(sistolica)) return "normal";

  if (sistolica >= 14) {
    return "alta";
  } else if (sistolica <= 9) {
    return "baixa";
  } else {
    return "normal";
  }
}

function excluirRegistro(id, linha) {

  let dados = JSON.parse(localStorage.getItem("registros")) || [];

  let novos = dados.filter(d => Number(d.id) !== Number(id));

  localStorage.setItem("registros", JSON.stringify(novos));

  linha.remove();
}

function seguro(valor, padrao = "N/A") {
  return valor !== undefined && valor !== null && valor !== ""
    ? valor
    : padrao;
}


function adicionarNaTabela(id, dataHora, nome, pressao, batimentos, respiracao) {
  let tabela = document.getElementById("tabela");
  let linha = tabela.insertRow();

  linha.setAttribute("data-id", id);

  let classe = classificarPressao(pressao);
  linha.classList.add(classe);

  linha.insertCell(0).innerText = dataHora;
  linha.insertCell(1).innerText = seguro(nome, "Sem nome");
  linha.insertCell(2).innerText = seguro(pressao);
  linha.insertCell(3).innerText = seguro(batimentos);
  linha.insertCell(4).innerText = seguro(respiracao);

  let cellAcao = linha.insertCell(5);
  let btn = document.createElement("button");
  btn.innerText = "🗑️";
  btn.classList.add("btn-excluir");

btn.onclick = function() {
  console.log("clicou", id);
  excluirRegistro(id, linha);
 
  };

  cellAcao.appendChild(btn);
}



function salvar(id, dataHora, nome, pressao, batimentos, respiracao) {
  
  let dados = [];

  try {
    dados = JSON.parse(localStorage.getItem("registros")) || [];
  } catch (erro) {
    console.log("Erro ao salvar");
    dados = [];
  }


dados.push({
  id,
  dataHora,
  nome: nome || "Sem nome",
  pressao: pressao || "N/A",
  batimentos: batimentos || "N/A",
  respiracao: respiracao || "N/A"
});

  localStorage.setItem("registros", JSON.stringify(dados));
} 

function carregar() {

  let tabela = document.getElementById("tabela");
  tabela.innerHTML = "";

    let dados = [];

    try {
    dados = JSON.parse(localStorage.getItem("registros")) || [];
  } catch (erro) {

    console.log("Erro no localStorage");
    localStorage.removeItem("registros");
    dados = [];
  }

  dados.forEach(d => {

    adicionarNaTabela(
      d.id,
      d.dataHora || "Sem data",
      d.nome || "Sem nome",
      d.pressao || "N/A",
      d.batimentos || "N/A",
      d.respiracao || "N/A"
    );

  });
}


function filtrar() {
  let filtro = document.getElementById("filtro").value.toLowerCase();
  let linhas = document.querySelectorAll("#tabela tr");

  linhas.forEach(linha => {
    let texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(filtro) ? "" : "none";
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById("btnSalvar");

  if (botao){
  botao.addEventListener("click", function () {
    registrar();
  });
}

carregar();
});
