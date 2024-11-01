import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const db = getDatabase();

// Nome fixo do autor - simulação para o login
const autorFixo = "Coelhin Nicolinha"; // Esse valor será dinâmico após o login

// Salvar Pensamento (CRUD: Create)
function salvarPensamento() {
  const pensamento = document.getElementById("note").value.trim(); // Remove espaços em branco nas pontas

  // Verifica se o campo pensamento está vazio
  if (pensamento === "") {
    alert("O campo de pensamento não pode estar vazio!");
    return; // Interrompe a função se o campo estiver vazio
  }

  const pensamentoRef = push(ref(db, "pensamentos"));
  set(pensamentoRef, {
    pensamento: pensamento, // Usando o campo "pensamento"
    autor: autorFixo, // Define o autor fixo
  });

  // Limpa o campo de entrada após salvar
  document.getElementById("note").value = "";
}

// Editar Pensamento (CRUD: Update)
function editarPensamento(id, novoPensamento) {
  if (novoPensamento.trim() === "") {
    alert("O campo de pensamento não pode estar vazio!");
    return;
  }

  const pensamentoRef = ref(db, `pensamentos/${id}`);
  update(pensamentoRef, {
    pensamento: novoPensamento,
  });
}

// Excluir Pensamento (CRUD: Delete)
function excluirPensamento(id) {
  const pensamentoRef = ref(db, `pensamentos/${id}`);
  remove(pensamentoRef);
}

// Renderizar os Pensamentos na Tela
function carregarPensamentos() {
  const listaPensamentos = document.getElementById("noteList");
  onValue(ref(db, "pensamentos"), (snapshot) => {
    listaPensamentos.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const pensamentoId = childSnapshot.key;
      const pensamentoData = childSnapshot.val();
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${pensamentoData.autor}</strong>: ${pensamentoData.pensamento}
        <button onclick="editarPensamento('${pensamentoId}', prompt('Edite o pensamento:', '${pensamentoData.pensamento}'))">Editar</button>
        <button onclick="excluirPensamento('${pensamentoId}')">Excluir</button>
      `;
      listaPensamentos.appendChild(listItem);
    });
  });
}

// Carrega os pensamentos ao abrir o site
carregarPensamentos();

// Exporta as funções para que possam ser acessadas no HTML
window.salvarPensamento = salvarPensamento;
window.editarPensamento = editarPensamento;
window.excluirPensamento = excluirPensamento;
