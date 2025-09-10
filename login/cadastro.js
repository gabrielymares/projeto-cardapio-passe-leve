const btnCadastro = document.getElementById("btnCadastro");
const btnLogin = document.getElementById("btnLogin");
const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");
const btnEnviarCadastro = document.getElementById("btnEnviarCadastro");
const cadastroInput = document.getElementById("cadastroInput");

// Função para alternar abas
function showTab(tab) {
  if (tab === "cadastro") {
    btnCadastro.classList.add("active");
    btnLogin.classList.remove("active");
    formCadastro.classList.add("active");
    formLogin.classList.remove("active");
  } else {
    btnLogin.classList.add("active");
    btnCadastro.classList.remove("active");
    formLogin.classList.add("active");
    formCadastro.classList.remove("active");
  }
}

// Eventos de clique nos botões
btnCadastro.addEventListener("click", () => showTab("cadastro"));
btnLogin.addEventListener("click", () => showTab("login"));

// Após cadastro, redirecionar automaticamente para Login
btnEnviarCadastro.addEventListener("click", (e) => {
  e.preventDefault(); // evita envio real
  alert("Cadastro realizado com sucesso!");
  showTab("login");
});

// Máscara dinâmica para Email ou Telefone
cadastroInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // Se começa com número → aplicar máscara de telefone
  if (/^\d/.test(value)) {
    // Remove tudo que não é número
    value = value.replace(/\D/g, "");

    // Aplica máscara (XX) XXXXX-XXXX
    if (value.length > 2 && value.length <= 7) {
      value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    } else if (value.length > 7) {
      value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7,11)}`;
    }
    e.target.value = value;

  } else {
    // Se começa com letra → validar como email (não aplicar máscara, só limitar caracteres inválidos)
    e.target.value = value.replace(/[^a-zA-Z0-9@._-]/g, "");
  }
});

   const btnEnviarLogin = document.getElementById("btnEnviarLogin");
btnEnviarLogin.addEventListener("click", () => {
  window.location.href = "../formulario/formulario.html";
});

