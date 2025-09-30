document.addEventListener('DOMContentLoaded', () => {
    const etapa1 = document.getElementById('etapa1');
    const etapa2 = document.getElementById('etapa2');
    const recuperarContatoInput = document.getElementById('recuperarContato');
    const btnGerarCodigo = document.getElementById('btnGerarCodigo');
    const codigoVerificacaoInput = document.getElementById('codigoVerificacao');
    const novaSenhaInput = document.getElementById('novaSenha');
    const confirmarNovaSenhaInput = document.getElementById('confirmarNovaSenha');
    const btnRedefinirSenha = document.getElementById('btnRedefinirSenha');
    const btnReenviar = document.getElementById('btnReenviar');
    const mensagem = document.getElementById('mensagem');

    let codigoGerado = '';
    let contatoParaRedefinicao = '';
    
    // Simula a função de máscara (copiada do seu cadastro.js)
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
    
    // Aplica a máscara ao input de contato
    recuperarContatoInput.addEventListener("input", applyContatoMask);
    recuperarContatoInput.addEventListener("blur", applyContatoMask);
    recuperarContatoInput.addEventListener("paste", () => setTimeout(applyContatoMask, 0));

    // Função para gerar um código numérico de 4 dígitos
    function gerarCodigo() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // --- ETAPA 1: Gerar Código ---
    btnGerarCodigo.addEventListener('click', (e) => {
        e.preventDefault();
        mensagem.textContent = '';
        
        const contatoDigitado = recuperarContatoInput.value.trim();
        if (!contatoDigitado) {
            mensagem.textContent = "Por favor, insira seu e-mail ou telefone.";
            return;
        }

        const dadosExistentes = JSON.parse(localStorage.getItem('dadosUsuario')) || {};
        
        // Verifica se o contato existe
        if (dadosExistentes.contato !== contatoDigitado) {
            // MENSAGEM GENÉRICA POR SEGURANÇA: NUNCA REVELE SE UM CONTATO EXISTE OU NÃO
            mensagem.textContent = "Se este contato estiver em nosso cadastro, você receberá um código em breve.";
            
            // Simula um atraso antes de mostrar a segunda etapa para manter a consistência
            setTimeout(() => {
                // Seta o código gerado, mesmo que o contato não exista, para evitar side-channel attacks.
                codigoGerado = gerarCodigo(); 
                contatoParaRedefinicao = contatoDigitado;
                
                // Exibe o código no console (SIMULAÇÃO DE ENVIO)
                console.log(`[SIMULAÇÃO] Código de Acesso para ${contatoDigitado}: ${codigoGerado}`);
                
                // Esconde a etapa 1 e mostra a etapa 2
                etapa1.classList.remove('active');
                etapa2.classList.add('active');
                mensagem.textContent = "Código de acesso gerado e pronto! (Verifique o console para o código)";
                
            }, 1000); // 1 segundo de atraso
            
            return;
        }

        // Se o contato for válido, gera e envia o código
        codigoGerado = gerarCodigo();
        contatoParaRedefinicao = contatoDigitado;
        
        // Exibe o código no console (SIMULAÇÃO DE ENVIO)
        console.log(`[SIMULAÇÃO] Código de Acesso para ${contatoDigitado}: ${codigoGerado}`);

        // Esconde a etapa 1 e mostra a etapa 2
        etapa1.classList.remove('active');
        etapa2.classList.add('active');
        mensagem.textContent = "Código de acesso enviado! (Verifique o console para o código)";
    });


    // --- ETAPA 2: Redefinir Senha ---
    btnRedefinirSenha.addEventListener('click', (e) => {
        e.preventDefault();
        mensagem.textContent = '';
        
        const codigoDigitado = codigoVerificacaoInput.value.trim();
        const novaSenha = novaSenhaInput.value.trim();
        const confirmarSenha = confirmarNovaSenhaInput.value.trim();
        
        // 1. Validação Simples de Campos
        if (!codigoDigitado || !novaSenha || !confirmarSenha) {
            mensagem.textContent = "Preencha o código e a nova senha.";
            return;
        }

        // 2. Validação do Código de Verificação
        if (codigoDigitado !== codigoGerado) {
            mensagem.textContent = "Código de verificação incorreto. Tente novamente.";
            return;
        }

        // 3. Validação de Senha Coincidente
        if (novaSenha !== confirmarSenha) {
            mensagem.textContent = "A nova senha e a confirmação não coincidem.";
            return;
        }
        
        // 4. VERIFICAÇÃO FINAL E ATUALIZAÇÃO DA SENHA
        const dadosExistentes = JSON.parse(localStorage.getItem('dadosUsuario')) || {};

        if (dadosExistentes.contato !== contatoParaRedefinicao) {
             mensagem.textContent = "Ocorreu um erro na verificação do contato. Tente novamente.";
             return;
        }

        // Se tudo estiver OK, ATUALIZA A SENHA no localStorage
        dadosExistentes.senha = novaSenha;
        localStorage.setItem('dadosUsuario', JSON.stringify(dadosExistentes));
        
        // Sucesso e Redirecionamento
        alert("Senha redefinida com sucesso! Você será redirecionado para a página de Login.");
        window.location.href = "../login/cadastro.html"; // Redireciona para a página de Login

    });
    
    // --- Reenviar Código ---
    btnReenviar.addEventListener('click', (e) => {
        e.preventDefault();
        // Reseta o processo para a etapa 1
        etapa2.classList.remove('active');
        etapa1.classList.add('active');
        recuperarContatoInput.value = contatoParaRedefinicao; // Mantém o contato preenchido
        mensagem.textContent = "Processo reiniciado. Gere um novo código.";
    });
});