function registrar() {
  let pressao = document.getElementById("pressao").value;
  let batimentos = document.getElementById("batimentos").value;
  

  if (pressao === "" || batimentos === "") {
    alert("Preencha tudo!");
    return;
  }

  let agora = new Date();
  let dataHora = agora.toLocaleString();
  let id = Date.now();

  adicionarNaTabela(id,dataHora, pressao, batimentos);
  salvar(id,dataHora, pressao, batimentos);

  document.getElementById("pressao").value = "";
  document.getElementById("batimentos").value = "";
}

function classificarPressao(pressao) {
  if (!pressao.includes("/")) return "normal";

  let partes = pressao.split("/");
  let sistolica = parseInt(partes[0]);

  if (isNaN(sistolica)) return "normal";

  if (sistolica >= 140) {
    return "alta";
  } else if (sistolica <= 90) {
    return "baixa";
  } else {
    return "normal";
  }
}


function adicionarNaTabela(id,dataHora, pressao, batimentos) {
  let tabela = document.getElementById("tabela");
  let linha = tabela.insertRow();

  linha.setAttribute("data-id", id)

  let classe = classificarPressao(pressao);
  linha.classList.add(classe);

  linha.insertCell(0).innerText = dataHora;
  linha.insertCell(1).innerText = pressao;
  linha.insertCell(2).innerText = batimentos;

  let cellAcao = linha.insertCell(3);
  let btn = document.createElement("button");
  btn.innerText = "🚮"
  btn.classList.add("btn-excluir");

  btn.onclick = function() {
    excluirRegistro(id, linha)
  };
  cellAcao.appendChild(btn);
}


function salvar(dataHora, pressao, batimentos) {
  let dados = JSON.parse(localStorage.getItem("registros")) || [];
  dados.push({ dataHora, pressao, batimentos });
  localStorage.setItem("registros", JSON.stringify(dados));
}
function excluirRegistro(id, linha) {
  linha.remove();

  let dados = JSON.parse(localStorage.getItem("registros")) || [];
  let novos = dados.filter(d => d.id !== id);
  localStorage.setItem("registros", JSON.stringify(novos));
}

function carregar() {
  let dados = JSON.parse(localStorage.getItem("registros")) || [];
  dados.forEach(d => adicionarNaTabela(d.dataHora, d.pressao, d.batimentos));
}

function filtrar() {
  let filtro = document.getElementById("filtro").value.toLowerCase();
  let linhas = document.querySelectorAll("#tabela tr");

  linhas.forEach(linha => {
    let texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(filtro) ? "" : "none";
  });
}

carregar();
