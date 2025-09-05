// Alternância entre abas
const tabCadastro = document.getElementById("tab-cadastro");
const tabLogin = document.getElementById("tab-login");
const formCadastro = document.getElementById("cadastro-form");
const formLogin = document.getElementById("login-form");

tabCadastro.addEventListener("click", () => {
  tabCadastro.classList.add("active");
  tabLogin.classList.remove("active");
  formCadastro.style.display = "flex";
  formLogin.style.display = "none";
});

tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabCadastro.classList.remove("active");
  formLogin.style.display = "flex";
  formCadastro.style.display = "none";
});

// SALVAR DADOS DO CADASTRO NO LOCALSTORAGE
formCadastro.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email-cadastro").value;
  const telefone = document.getElementById("telefone-cadastro").value;
  const senha = document.getElementById("senha-cadastro").value;

  const usuario = { email, telefone, senha };

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Cadastro realizado com sucesso!");
  formCadastro.reset();
});



const telefoneInput = document.getElementById("telefone-cadastro");

telefoneInput.addEventListener("input", function(e) {
  let valor = telefoneInput.value.replace(/\D/g, ""); // remove tudo que não é número
  if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos

  // aplica a máscara: 00 00000-0000
  valor = valor.replace(/^(\d{2})(\d)/g, "$1 $2");        // adiciona espaço depois do DDD
  valor = valor.replace(/(\d{5})(\d{1,4})$/, "$1-$2");   // adiciona hífen

  telefoneInput.value = valor;
});

// LOGIN usando LocalStorage
formLogin.addEventListener("submit", function(e) {
  e.preventDefault();

  const emailLogin = document.getElementById("email-login").value;
  const senhaLogin = document.getElementById("senha-login").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuarios.find(u => u.email === emailLogin && u.senha === senhaLogin);

  if(usuarioEncontrado) {
    alert("Login realizado com sucesso!");
    // redireciona para outra página
    window.location.href = "../avaliaçao/avaliacao.html"; // troque pelo link desejado
  } else {
    alert("Email ou senha incorretos!");
  }
});
