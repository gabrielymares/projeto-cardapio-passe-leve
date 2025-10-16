// Variáveis Globais de Estado (Corrigido: Adicionadas)
// Estes valores devem ser obtidos da navegação ou contexto real.
// Para fins de teste, inicializamos:
let clienteAtual = 1;      // ID do Cliente
let semanaAtual = 1;       // Número da Semana
let diaAtual = null;
let refeicaoEditando = null;

// Funções de armazenamento (Mantidas)
function getCardapio() {
    const chave = `cardapio_cliente${clienteAtual}`;
    const cardapio = localStorage.getItem(chave);
    return cardapio ? JSON.parse(cardapio) : {};
}

function saveCardapio(cardapio) {
    const chave = `cardapio_cliente${clienteAtual}`;
    localStorage.setItem(chave, JSON.stringify(cardapio));
}

// -------------------------------------------------------------
// FUNÇÕES DE RENDERIZAÇÃO NOVAS / COMPLETAS
// -------------------------------------------------------------

// Adicionada: Função para gerar o HTML do indicador de progresso
function renderizarIndicadorProgresso(progresso, totalRefeicoes) {
    if (totalRefeicoes === 0) {
        return `<span style="color: #999;" title="Nenhuma refeição cadastrada">Sem Plano</span>`;
    }
    const cor = progresso === 100 ? '#4caf50' : '#e74c3c';
    return `<span style="color: ${cor}; font-weight: 600;" title="${progresso}% de refeições concluídas">${progresso}%</span>`;
}

// Adicionada: Função para gerar o HTML da lista de refeições de um dia
function renderizarRefeicoes(refeicoes, numeroDia) {
    if (refeicoes.length === 0) {
        return `<div class="mensagem-vazio">Nenhuma refeição cadastrada. Clique em 'Adicionar Refeição' para começar.</div>`;
    }

    return refeicoes.map((refeicao, index) => `
        <div class="refeicao-item">
            <div class="refeicao-conteudo">
                <div class="refeicao-tipo">${refeicao.tipo}</div>
                <div class="refeicao-horario">⏰ ${refeicao.horario}</div>
                <div class="refeicao-detalhe">Alimento: ${refeicao.alimento}</div>
                <div class="refeicao-detalhe">Quantidade: ${refeicao.quantidade}</div>
            </div>
            <button class="btn-editar-refeicao" onclick="editarRefeicao(${numeroDia}, ${index})" title="Editar Refeição">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// Adicionada: Função placeholder para obter progresso (necessária para salvarRefeicao)
function obterProgressoDia(numeroDia) {
    // Implementação real exigiria dados de check-in de refeições, que não temos.
    // Retornamos 0% se for um dia ímpar, 100% se for um dia par (apenas para simular o indicador)
    return numeroDia % 2 === 0 ? 100 : 0; 
}


// Criar card de um dia (Corrigido: Função Completada)
function criarCardDia(numeroDia) {
    const cardapio = getCardapio();
    let refeicoesDoDia = cardapio[`semana${semanaAtual}`]?.[`dia${numeroDia}`] || [];

    // Ordena as refeições
    refeicoesDoDia.sort((a, b) => {
        if (a.horario < b.horario) return -1;
        if (a.horario > b.horario) return 1;
        return 0;
    });
    
    // Obter progresso (para o cabeçalho)
    const progressoDia = obterProgressoDia(numeroDia);
    const nomeDia = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][numeroDia % 7]; // Ajuste a lógica do dia da semana se necessário
    
    // Criar o elemento do card
    const diaCard = document.createElement('div');
    diaCard.className = 'dia-card';
    diaCard.innerHTML = `
        <div class="dia-header" onclick="toggleDia(${numeroDia})">
            <div>
                <h2 class="dia-titulo">${nomeDia.toUpperCase()} - DIA ${numeroDia}</h2>
                ${renderizarIndicadorProgresso(progressoDia, refeicoesDoDia.length)}
            </div>
            <span class="toggle-icon" id="toggle-${numeroDia}">+</span>
        </div>
        <div class="conteudo-dia" id="conteudo-${numeroDia}">
            <div class="refeicoes-list" id="refeicoes-${numeroDia}">
                ${renderizarRefeicoes(refeicoesDoDia, numeroDia)}
            </div>
            <button class="btn-adicionar" onclick="abrirModal(${numeroDia})">Adicionar Refeição</button>
        </div>
    `;
    
    return diaCard;
}


// Renderizar todos os dias da semana (Mantida)
function renderizarDias() {
    // Atualiza o título H1 com a semana atual
    document.getElementById('tituloSemana').textContent = `Semana ${semanaAtual}`;
    
    const container = document.getElementById('diasContainer');
    container.innerHTML = '';
    
    for (let dia = 1; dia <= 7; dia++) {
        const diaCard = criarCardDia(dia);
        container.appendChild(diaCard);
    }
}

// Toggle (abrir/fechar) dia (Mantida)
function toggleDia(numeroDia) {
    const conteudo = document.getElementById(`conteudo-${numeroDia}`);
    const toggle = document.getElementById(`toggle-${numeroDia}`);
    
    conteudo.classList.toggle('expanded');
    toggle.classList.toggle('rotated');
}

// Abrir modal para adicionar refeição (Mantida)
function abrirModal(dia, refeicaoIndex = null) {
    diaAtual = dia;
    refeicaoEditando = refeicaoIndex;
    
    const modal = document.getElementById('modalRefeicao');
    modal.classList.add('active');
    
    if (refeicaoIndex !== null) {
        // Modo edição
        document.getElementById('modalTitulo').textContent = 'Editar Refeição';
        const cardapio = getCardapio();
        
        const refeicoes = cardapio[`semana${semanaAtual}`]?.[`dia${dia}`];
        if (!refeicoes || !refeicoes[refeicaoIndex]) {
             console.error("Refeição não encontrada para edição.");
             fecharModal();
             return;
        }
        
        const refeicao = refeicoes[refeicaoIndex];
        
        document.getElementById('tipoRefeicao').value = refeicao.tipo;
        document.getElementById('horario').value = refeicao.horario;
        document.getElementById('alimento').value = refeicao.alimento;
        document.getElementById('gramas').value = refeicao.quantidade;
    } else {
        // Modo adicionar
        document.getElementById('modalTitulo').textContent = 'Adicionar Refeição';
        document.getElementById('tipoRefeicao').value = 'Café da manhã';
        document.getElementById('horario').value = '';
        document.getElementById('alimento').value = '';
        document.getElementById('gramas').value = '';
    }
}

// Fechar modal (Mantida)
function fecharModal() {
    const modal = document.getElementById('modalRefeicao');
    modal.classList.remove('active');
    diaAtual = null;
    refeicaoEditando = null;
}

// Salvar refeição (Mantida, com ajuste no indicador)
function salvarRefeicao() {
    const tipo = document.getElementById('tipoRefeicao').value;
    const horario = document.getElementById('horario').value;
    const alimento = document.getElementById('alimento').value;
    const quantidade = document.getElementById('gramas').value;
    
    if (!horario || !alimento || !quantidade) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    const novaRefeicao = {
        tipo,
        horario,
        alimento,
        quantidade
    };
    
    const cardapio = getCardapio();
    
    // Garantir que a estrutura existe
    if (!cardapio[`semana${semanaAtual}`]) {
        cardapio[`semana${semanaAtual}`] = {};
    }
    if (!cardapio[`semana${semanaAtual}`][`dia${diaAtual}`]) {
        cardapio[`semana${semanaAtual}`][`dia${diaAtual}`] = [];
    }
    
    if (refeicaoEditando !== null) {
        // Editar refeição existente
        cardapio[`semana${semanaAtual}`][`dia${diaAtual}`][refeicaoEditando] = novaRefeicao;
    } else {
        // Adicionar nova refeição
        cardapio[`semana${semanaAtual}`][`dia${diaAtual}`].push(novaRefeicao);
    }
    
    // Ordenar o array de refeições por horário antes de salvar
    cardapio[`semana${semanaAtual}`][`dia${diaAtual}`].sort((a, b) => {
        if (a.horario < b.horario) return -1;
        if (a.horario > b.horario) return 1;
        return 0;
    });

    saveCardapio(cardapio);
    
    // Atualizar apenas o dia modificado
    const refeicoesContainer = document.getElementById(`refeicoes-${diaAtual}`);
    const refeicoes = cardapio[`semana${semanaAtual}`][`dia${diaAtual}`];
    refeicoesContainer.innerHTML = renderizarRefeicoes(refeicoes, diaAtual);
    
    // Atualizar o indicador de progresso no header do dia (busca o progresso atualizado)
    const progressoDia = obterProgressoDia(diaAtual);
    const diaHeader = document.querySelector(`#conteudo-${diaAtual}`).previousElementSibling;
    const indicadorDiv = diaHeader.querySelector('div');
    
    // O nome do dia precisa ser resgatado
    const nomeDia = diaHeader.querySelector('.dia-titulo').textContent.split(' - ')[0]; 

    indicadorDiv.innerHTML = `
        <h2 class="dia-titulo">${nomeDia} - DIA ${diaAtual}</h2>
        ${renderizarIndicadorProgresso(progressoDia, refeicoes.length)}
    `;
    
    fecharModal();
}

// Editar refeição (Mantida)
function editarRefeicao(dia, index) {
    abrirModal(dia, index);
}

// Voltar para detalhes do cliente (Mantida)
function voltarParaDetalhes() {
    window.history.back();
}

// Fechar modal ao clicar fora (Mantida)
document.getElementById('modalRefeicao').addEventListener('click', (e) => {
    if (e.target.id === 'modalRefeicao') {
        fecharModal();
    }
});


// CORREÇÃO CRÍTICA: Inicializar a renderização da página
document.addEventListener('DOMContentLoaded', () => {
    // Define o título inicial
    document.getElementById('tituloSemana').textContent = `Semana ${semanaAtual}`;
    
    // Renderiza os dias
    renderizarDias(); 
});