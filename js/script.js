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
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

let autorFixo = "🐰❓ Coelhin Sem Nome";

// Monitora o estado da autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    autorFixo = "🐰 Coelhin " + (user.displayName || "Sem Nome");
    console.log("Usuário autenticado:", autorFixo);
    e;
  } else {
    console.log("Usuário não autenticado");
  }
});

// Salvar Pensamento (CRUD: Create)
function salvarPensamento() {
  const pensamento = document.getElementById("note").value.trim();

  if (pensamento === "") {
    alert("O campo de pensamento não pode estar vazio!");
    return;
  }

  const pensamentoRef = push(ref(db, "pensamentos"));
  set(pensamentoRef, {
    pensamento: pensamento,
    autor: autorFixo,
  });

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

carregarPensamentos();

window.salvarPensamento = salvarPensamento;
window.editarPensamento = editarPensamento;
window.excluirPensamento = excluirPensamento;
