document.addEventListener('DOMContentLoaded', () => {
    carregarPerfilNutricionista();
    document.getElementById('logout-button').addEventListener('click', fazerLogout);
});

// Dados de exemplo para o Nutricionista (Substitua por dados reais se necessário)
const DADOS_NUTRICIONISTA_EXEMPLO = {
    nome: "Dra. Ana Silva",
    crn: "12345/SP",
    email: "ana.silva@passeleve.com",
    contato: "(11) 99887-7654",
    planosCadastrados: 12
};

function carregarPerfilNutricionista() {
    // 1. Tenta carregar dados do Nutricionista do localStorage (se houver um login específico)
    const dadosNutriSalvos = localStorage.getItem('dadosNutricionista') || JSON.stringify(DADOS_NUTRICIONISTA_EXEMPLO);
    const dadosNutri = JSON.parse(dadosNutriSalvos);

    // 2. Preenche as informações profissionais
    document.getElementById('nutri-nome').textContent = dadosNutri.nome || '--';
    document.getElementById('nutri-crn').textContent = dadosNutri.crn || '--';
    document.getElementById('nutri-email').textContent = dadosNutri.email || '--';
    document.getElementById('nutri-contato').textContent = dadosNutri.contato || '--';
    
    // 3. Calcula e exibe o número de clientes
    // Busca a chave 'clientes' que é usada na lista de clientes
    const clientesSalvos = localStorage.getItem('clientes');
    let totalClientes = 0;
    if (clientesSalvos) {
        try {
            const clientes = JSON.parse(clientesSalvos);
            totalClientes = clientes.length;
        } catch (e) {
            console.error("Erro ao ler lista de clientes:", e);
        }
    }
    document.getElementById('total-clientes').textContent = totalClientes;
    
    // 4. Preenche o status da conta
    document.getElementById('planos-cadastrados').textContent = dadosNutri.planosCadastrados || '0';
    
    // O último login geralmente seria uma data salva na hora do login.
    const ultimoLogin = localStorage.getItem('nutriUltimoLogin') || 'Não registrado';
    document.getElementById('ultimo-login').textContent = ultimoLogin;
}

function fazerLogout() {
    // Limpa o status de login (você pode ajustar as chaves conforme seu sistema)
    localStorage.removeItem('nutricionistaLogado');
    localStorage.removeItem('nutriUltimoLogin');
    
    // Redireciona para a tela de login
    // Ajuste o caminho '../login/login.html' para o caminho correto da sua tela de login
    alert("Logout realizado com sucesso!");
    window.location.href = '../login/login.html'; 
}