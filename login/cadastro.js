const btnCadastro = document.getElementById("btnCadastro");
const btnLogin = document.getElementById("btnLogin");
const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");
const btnEnviarCadastro = document.getElementById("btnEnviarCadastro");
const btnEnviarLogin = document.getElementById("btnEnviarLogin");
const cadastroInput = document.getElementById("cadastroInput");
const loginInput = document.getElementById("loginInput");

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

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar telefone
function isValidPhone(phone) {
  // Remove todos os caracteres não numéricos
  const numbersOnly = phone.replace(/\D/g, "");
  // Verifica se tem 10 ou 11 dígitos
  return numbersOnly.length === 10 || numbersOnly.length === 11;
}

// Função para mostrar erro
function showError(message) {
  // Remove erro anterior se existir
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Cria nova mensagem de erro
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    background: #ff4444;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin: 10px 0;
    text-align: center;
    font-size: 0.9rem;
    animation: shake 0.5s ease-in-out;
  `;

  // Adiciona animação de shake
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  return errorDiv;
}

// Função para aplicar máscara de telefone
function applyPhoneMask(value) {
  // Remove tudo que não é número
  let numbers = value.replace(/\D/g, "");
  
  // Limita a 11 dígitos
  numbers = numbers.substring(0, 11);
  
  // Aplica a máscara baseada na quantidade de dígitos
  if (numbers.length === 0) {
    return '';
  } else if (numbers.length === 1) {
    return numbers;
  } else if (numbers.length === 2) {
    return `(${numbers})`;
  } else if (numbers.length <= 6) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
  } else if (numbers.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
  } else {
    // Celular: (11) 12345-6789
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  }
}

// Função para aplicar máscara em qualquer input
function handleInputMask(e) {
  let value = e.target.value;
  
  // Se começa com número → aplicar máscara de telefone
  if (/^\d/.test(value)) {
    e.target.value = applyPhoneMask(value);
  } else {
    // Se começa com letra → validar como email (não aplicar máscara)
    e.target.value = value.replace(/[^a-zA-Z0-9@._-]/g, "");
  }
}

// Função para validar campos do cadastro
function validateCadastro() {
  const emailTelefone = cadastroInput.value.trim();
  const senha = formCadastro.querySelector('input[type="password"]').value.trim();

  // Verifica se os campos estão preenchidos
  if (!emailTelefone) {
    const errorDiv = showError('Por favor, preencha o campo Email/Telefone');
    formCadastro.insertBefore(errorDiv, formCadastro.firstChild);
    return false;
  }

  if (!senha) {
    const errorDiv = showError('Por favor, preencha o campo Senha');
    formCadastro.insertBefore(errorDiv, formCadastro.firstChild);
    return false;
  }

  // Valida se é email ou telefone
  const isEmail = emailTelefone.includes('@');
  const isPhone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(emailTelefone);

  if (isEmail) {
    if (!isValidEmail(emailTelefone)) {
      const errorDiv = showError('Por favor, insira um email válido');
      formCadastro.insertBefore(errorDiv, formCadastro.firstChild);
      return false;
    }
  } else if (isPhone) {
    if (!isValidPhone(emailTelefone)) {
      const errorDiv = showError('Por favor, insira um telefone válido');
      formCadastro.insertBefore(errorDiv, formCadastro.firstChild);
      return false;
    }
  } else {
    const errorDiv = showError('Por favor, insira um email ou telefone válido');
    formCadastro.insertBefore(errorDiv, formCadastro.firstChild);
    return false;
  }

  // Valida senha (mínimo 6 caracteres)
  if (senha.length < 6) {
    const errorDiv = showError('A senha deve ter pelo menos 6 caracteres');
    formCadastro.insertBefore(errorDiv, formCadastro.firstChild);
    return false;
  }

  return true;
}

// Função para validar campos do login
function validateLogin() {
  const emailTelefone = loginInput.value.trim();
  const senha = formLogin.querySelector('input[type="password"]').value.trim();

  // Verifica se os campos estão preenchidos
  if (!emailTelefone) {
    const errorDiv = showError('Por favor, preencha o campo Email/Telefone');
    formLogin.insertBefore(errorDiv, formLogin.firstChild);
    return false;
  }

  if (!senha) {
    const errorDiv = showError('Por favor, preencha o campo Senha');
    formLogin.insertBefore(errorDiv, formLogin.firstChild);
    return false;
  }

  // Validações básicas de formato
  const isEmail = emailTelefone.includes('@');
  if (isEmail && !isValidEmail(emailTelefone)) {
    const errorDiv = showError('Por favor, insira um email válido');
    formLogin.insertBefore(errorDiv, formLogin.firstChild);
    return false;
  }

  return true;
}

// Aplicar máscara no campo de cadastro
cadastroInput.addEventListener("input", handleInputMask);

// Aplicar máscara no campo de login
loginInput.addEventListener("input", handleInputMask);

// Após cadastro, redirecionar automaticamente para Login (COM VALIDAÇÃO)
btnEnviarCadastro.addEventListener("click", (e) => {
  e.preventDefault(); // evita envio real
  
  // Valida antes de prosseguir
  if (validateCadastro()) {
    alert("Cadastro realizado com sucesso!");
    showTab("login");
    
    // Limpa os campos do cadastro
    cadastroInput.value = '';
    formCadastro.querySelector('input[type="password"]').value = '';
    
    // Remove mensagens de erro se existirem
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
});

// Login com validação
btnEnviarLogin.addEventListener("click", (e) => {
  e.preventDefault(); // evita envio real
  
  // Valida antes de prosseguir
  if (validateLogin()) {
    // Se a validação passou, redireciona
    window.location.href = "../formulario/formulario.html";
  }
});

// Remove mensagens de erro quando o usuário começa a digitar
document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') {
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
});

console.log("JavaScript carregado com sucesso!");