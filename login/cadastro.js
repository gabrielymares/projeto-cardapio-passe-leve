// ==== Elementos de UI Comuns ====
const btnCadastro = document.getElementById("btnCadastro");
const btnLogin = document.getElementById("btnLogin");
const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");

// Elementos de Seleção de Tipo
const userTypeTabs = document.querySelectorAll(".type-tab");
const cadastroNutricionista = document.getElementById("cadastroNutricionista");
const cadastroPaciente = document.getElementById("cadastroPaciente");

// Variável de controle
let userTypeAtual = 'nutricionista';
let dadosCadastroTemp = {};

// ==== Elementos do Nutricionista ====
const nutriFase1 = document.getElementById("nutriFase1");
const nutriFase2 = document.getElementById("nutriFase2");
const btnNutriProximaFase = document.getElementById("btnNutriProximaFase");
const btnNutriFinalizarCadastro = document.getElementById("btnNutriFinalizarCadastro");
const btnVoltarFase = document.getElementById("btnVoltarFase");

const nutriCadastroInput = document.getElementById("nutriCadastroInput");
const nutriSenhaCadastroInput = document.getElementById("nutriSenhaCadastroInput");
const nutriConfirmarSenhaInput = document.getElementById("nutriConfirmarSenhaInput");
const nomeNutriInput = document.getElementById("nomeNutriInput");
const crnNutriInput = document.getElementById("crnNutriInput");
const contatoNutriInput = document.getElementById("contatoNutriInput");

// ==== Elementos do Paciente ====
const btnPacienteFinalizarCadastro = document.getElementById("btnPacienteFinalizarCadastro");
const pacienteNomeInput = document.getElementById("pacienteNomeInput");
const pacienteCadastroInput = document.getElementById("pacienteCadastroInput");
const pacienteSenhaCadastroInput = document.getElementById("pacienteSenhaCadastroInput");
const pacienteConfirmarSenhaInput = document.getElementById("pacienteConfirmarSenhaInput");

// ==== Elementos de Login ====
const btnEnviarLogin = document.getElementById("btnEnviarLogin");
const loginInput = document.getElementById("loginInput");
const senhaLoginInput = document.getElementById("senhaLoginInput"); 


// ==== Funções de Máscara ====

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

    // Prioriza modo Email se encontrar @
    if (val.includes("@") || !/^[\d()\s\-]*$/.test(val)) {
        e.target.setAttribute("inputmode", "email");
        e.target.maxLength = 254;
        e.target.value = val;
        return;
    }

    // Aplica a máscara de telefone
    const digits = val.replace(/\D/g, "");
    if (digits.length > 0 || val.includes("(")) {
        e.target.setAttribute("inputmode", "tel");
        e.target.maxLength = 16;
        e.target.value = maskPhoneBR(digits);
        return;
    }
}

function addMaskListeners(inputElement) {
    if (inputElement) {
        inputElement.addEventListener("input", applyContatoMask);
        inputElement.addEventListener("blur", applyContatoMask);
        inputElement.addEventListener("paste", () => setTimeout(applyContatoMask, 0));
    }
}

// Aplica a máscara a todos os campos de contato/login
addMaskListeners(nutriCadastroInput);
addMaskListeners(contatoNutriInput);
addMaskListeners(pacienteCadastroInput);
addMaskListeners(loginInput);


// ==== Funções de Controle de UI ====

function showTab(tab) {
    if (tab === "cadastro") {
        btnCadastro.classList.add("active");
        btnLogin.classList.remove("active");
        formCadastro.classList.add("active");
        formLogin.classList.remove("active");
        
        // Garante que a fase correta do tipo ativo seja exibida
        showNutriFase(1); 
        showUserTypeForm(userTypeAtual);
    } else {
        btnLogin.classList.add("active");
        btnCadastro.classList.remove("active");
        formLogin.classList.add("active");
        formCadastro.classList.remove("active");
    }
}

function showNutriFase(faseNumber) {
    if (faseNumber === 1) {
        nutriFase1.classList.add("active");
        nutriFase2.classList.remove("active");
    } else {
        nutriFase2.classList.add("active");
        nutriFase1.classList.remove("active");
        
        if (!contatoNutriInput.value) {
            contatoNutriInput.value = nutriCadastroInput.value;
            applyContatoMask({target: contatoNutriInput});
        }
    }
}

function showUserTypeForm(type) {
    userTypeAtual = type;
    
    // Atualiza a barra de seleção de tipo (Nutri/Paciente)
    userTypeTabs.forEach(tab => {
        if (tab.getAttribute('data-type') === type) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Exibe o formulário de tipo correto
    if (type === 'nutricionista') {
        cadastroNutricionista.classList.add('active');
        cadastroPaciente.classList.remove('active');
        showNutriFase(1); // Sempre volta para a Fase 1 do Nutri
    } else {
        cadastroPaciente.classList.add('active');
        cadastroNutricionista.classList.remove('active');
    }
}


// ==== Eventos de Clique ====

// Tabs Cadastro/Login
btnCadastro.addEventListener("click", () => showTab("cadastro"));
btnLogin.addEventListener("click", () => showTab("login"));

// Tabs Tipo de Usuário (Nutricionista/Paciente)
userTypeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        showUserTypeForm(tab.getAttribute('data-type'));
    });
});


// ==== Lógica de Cadastro do NUTRICIONISTA (2 Fases) ====

btnNutriProximaFase.addEventListener("click", (e) => {
    e.preventDefault();

    if (!nutriCadastroInput.value.trim() || !nutriSenhaCadastroInput.value.trim() || !nutriConfirmarSenhaInput.value.trim()) {
        alert("Preencha todos os campos de acesso.");
        return;
    }
    if (nutriSenhaCadastroInput.value.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
    }
    if (nutriSenhaCadastroInput.value !== nutriConfirmarSenhaInput.value) {
        alert("As senhas não coincidem.");
        return;
    }

    dadosCadastroTemp = {
        contatoAcesso: nutriCadastroInput.value.trim(),
        senha: nutriSenhaCadastroInput.value
    };

    showNutriFase(2);
});

btnNutriFinalizarCadastro.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (!nomeNutriInput.value.trim() || !crnNutriInput.value.trim() || !contatoNutriInput.value.trim()) {
        alert("Preencha todos os dados profissionais.");
        return;
    }
    
    const dadosNutricionistaCompleto = {
        tipo: 'nutricionista', // CHAVE CRUCIAL
        ...dadosCadastroTemp,
        nome: nomeNutriInput.value.trim(),
        crn: crnNutriInput.value.trim(),
        contatoProfissional: contatoNutriInput.value.trim(),
        dataCadastro: new Date().toISOString()
    };

    // Salva o Nutricionista
    localStorage.setItem(`user_${dadosNutricionistaCompleto.contatoAcesso}`, JSON.stringify(dadosNutricionistaCompleto));
    
    alert(`Cadastro da(o) ${dadosNutricionistaCompleto.nome} (Nutricionista) finalizado com sucesso!`);
    
    dadosCadastroTemp = {}; 
    showTab("login");
    // Limpar campos
    nutriCadastroInput.value = '';
    nutriSenhaCadastroInput.value = '';
    nutriConfirmarSenhaInput.value = '';
});

// Botão Voltar da Fase 2 do Nutricionista
btnVoltarFase.addEventListener("click", () => showNutriFase(1));


// ==== Lógica de Cadastro do PACIENTE (1 Fase) ====

btnPacienteFinalizarCadastro.addEventListener("click", (e) => {
    e.preventDefault();

    if (!pacienteNomeInput.value.trim() || !pacienteCadastroInput.value.trim() || 
        !pacienteSenhaCadastroInput.value.trim() || !pacienteConfirmarSenhaInput.value.trim()) {
        alert("Preencha todos os campos do paciente.");
        return;
    }
    if (pacienteSenhaCadastroInput.value.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
    }
    if (pacienteSenhaCadastroInput.value !== pacienteConfirmarSenhaInput.value) {
        alert("As senhas não coincidem.");
        return;
    }

    const dadosPaciente = {
        tipo: 'paciente', // CHAVE CRUCIAL
        nome: pacienteNomeInput.value.trim(),
        contatoAcesso: pacienteCadastroInput.value.trim(),
        senha: pacienteSenhaCadastroInput.value,
        dataCadastro: new Date().toISOString()
    };

    // Salva o Paciente
    localStorage.setItem(`user_${dadosPaciente.contatoAcesso}`, JSON.stringify(dadosPaciente));

    alert(`Cadastro do(a) ${dadosPaciente.nome} (Paciente) finalizado com sucesso!`);

    // Limpar campos e ir para o login
    showTab("login");
    pacienteNomeInput.value = '';
    pacienteCadastroInput.value = '';
    pacienteSenhaCadastroInput.value = '';
    pacienteConfirmarSenhaInput.value = '';
});


// ==== Lógica de LOGIN (Unificada) ====

btnEnviarLogin.addEventListener("click", (e) => {
    e.preventDefault();

    if (!loginInput.value.trim() || !senhaLoginInput.value.trim()) {
        alert("Preencha o Email/Telefone e a Senha.");
        return;
    }

    const contatoDigitado = loginInput.value.trim();
    const senhaDigitada = senhaLoginInput.value;
    
    const dadosCadastradosJSON = localStorage.getItem(`user_${contatoDigitado}`);

    if (!dadosCadastradosJSON) {
        alert("Credenciais inválidas. Usuário não encontrado.");
        return;
    }

    const dadosCadastrados = JSON.parse(dadosCadastradosJSON);

    // 1. Verifica a senha
    if (dadosCadastrados.senha !== senhaDigitada) {
        alert("Credenciais inválidas. Senha incorreta.");
        return;
    }
    
    // 2. Login bem-sucedido: Armazena dados de sessão
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioTipo', dadosCadastrados.tipo);
    localStorage.setItem('usuarioContato', contatoDigitado);
    
    // 3. Redirecionamento baseado no tipo de usuário
    if (dadosCadastrados.tipo === 'nutricionista') {
        localStorage.setItem('dadosNutricionista', JSON.stringify(dadosCadastrados));
        window.location.href = "../Wnutricionista/telainicial.html"; // Redirecionamento Nutri
    } else {
        localStorage.setItem('dadosPaciente', JSON.stringify(dadosCadastrados));
        window.location.href = "../formulario/formulario.html"; // Redirecionamento Paciente
    }
});

// ==== Inicialização Corrigida ====
document.addEventListener('DOMContentLoaded', () => {
    // 1. Define o estado inicial padrão
    userTypeAtual = 'nutricionista'; 
    
    // 2. Ativa a aba de Cadastro e a aba Nutricionista (caso o navegador não mantenha o estado)
    showTab("cadastro"); 
    showUserTypeForm(userTypeAtual);
});