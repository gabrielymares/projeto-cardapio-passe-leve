const btnCadastro = document.getElementById("btnCadastro");
const btnLogin = document.getElementById("btnLogin");
const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");
const btnEnviarCadastro = document.getElementById("btnEnviarCadastro");
const cadastroInput = document.getElementById("cadastroInput");
const btnEnviarLogin = document.getElementById("btnEnviarLogin");
const loginInput = document.getElementById("loginInput");

// Adicionei estas constantes para os campos de senha
const senhaCadastroInput = document.getElementById("senhaCadastroInput");
const confirmarSenhaInput = document.getElementById("confirmarSenhaInput");

// ==== Funções de máscara para o contato ====

function maskPhoneBR(digits) {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function applyContatoMask(e) {
  let val = e.target.value || "";
  val = val.trim();

  if (val.includes("@")) {
    e.target.setAttribute("inputmode", "email");
    e.target.maxLength = 254;
    e.target.value = val;
    return;
  }

  if (/^[\d()\s\-]*$/.test(val)) {
    const digits = val.replace(/\D/g, "");
    e.target.setAttribute("inputmode", "tel");
    e.target.maxLength = 16;
    e.target.value = maskPhoneBR(digits);
  } else {
    e.target.setAttribute("inputmode", "email");
    e.target.maxLength = 254;
    e.target.value = val;
  }
}

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
  e.preventDefault();

  // O ponto chave: validação para garantir que as senhas são idênticas
  if (senhaCadastroInput.value !== confirmarSenhaInput.value) {
    alert("As senhas não coincidem. Por favor, tente novamente.");
    return; // Interrompe a execução se as senhas não combinarem
  }
  
  alert("Cadastro realizado com sucesso!");
  showTab("login");
});

// Aplica a nova máscara a ambos os campos
function addMaskListeners(inputElement) {
  if (inputElement) {
    inputElement.addEventListener("input", applyContatoMask);
    inputElement.addEventListener("blur", applyContatoMask);
    inputElement.addEventListener("paste", () => setTimeout(applyContatoMask, 0));
  }
}

addMaskListeners(cadastroInput);
addMaskListeners(loginInput);


// Ao clicar em 'Entrar', salva o contato e redireciona
btnEnviarLogin.addEventListener("click", () => {
  const contato = loginInput.value;
  const dadosExistentes = JSON.parse(localStorage.getItem('dadosUsuario')) || {};
  dadosExistentes.contato = contato;
  localStorage.setItem('dadosUsuario', JSON.stringify(dadosExistentes));

  window.location.href = "../formulario/formulario.html";
});