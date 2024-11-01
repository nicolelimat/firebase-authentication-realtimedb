import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"; // Importa o auth

const db = getDatabase();
const auth = getAuth();

// Nome fixo do autor - simulação para o login
let autorFixo = "🐰❓ Coelhin Sem Nome"; // Esse valor será dinâmico após o login

// Monitora o estado da autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Se o usuário estiver autenticado
    autorFixo = "🐰 Coelhin " + (user.displayName || "Sem Nome"); // Pega o nome do usuário, se disponível
    console.log("Usuário autenticado:", autorFixo); // Verifica se está pegando o nome
  } else {
    console.log("Usuário não autenticado");
  }
});

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
    listaPensamentos.innerHTML = ""; // Limpa a lista antes de preencher

    snapshot.forEach((childSnapshot) => {
      const pensamentoId = childSnapshot.key;
      const pensamentoData = childSnapshot.val();

      // Adiciona o pensamento no início da lista
      listaPensamentos.insertAdjacentHTML(
        "afterbegin",
        `
        <li>
          <strong>${pensamentoData.autor}</strong>: ${pensamentoData.pensamento}
          <button onclick="editarPensamento('${pensamentoId}', prompt('Edite o pensamento:', '${pensamentoData.pensamento}'))">Editar</button>
          <button onclick="excluirPensamento('${pensamentoId}')">Excluir</button>
        </li>
      `
      );
    });
  });
}

// Carrega os pensamentos ao abrir o site
carregarPensamentos();

// Exporta as funções para que possam ser acessadas no HTML
window.salvarPensamento = salvarPensamento;
window.editarPensamento = editarPensamento;
window.excluirPensamento = excluirPensamento;
