document.addEventListener('DOMContentLoaded', () => {
    // Referência aos elementos HTML
    const userNameSpan = document.getElementById('user-name');
    const userEmailSpan = document.getElementById('user-email');
    const userCpfSpan = document.getElementById('user-cpf');
    const pontuacaoUsuarioSpan = document.getElementById('pontuacao-usuario');
    const pontuacaoTotalSpan = document.getElementById('pontuacao-total');
    const condicoesListUl = document.getElementById('condicoes-lista-perfil');

    // Tenta carregar os dados da última avaliação do localStorage
    const dadosSalvos = localStorage.getItem('ultimaAvaliacao');

    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            // Exibe as informações do usuário
            if (userNameSpan) {
                userNameSpan.textContent = dados.nome || 'Não informado';
            }
            if (userEmailSpan) {
                userEmailSpan.textContent = dados.email || 'Não informado';
            }
            if (userCpfSpan) {
                userCpfSpan.textContent = dados.cpf || 'Não informado';
            }

            // Exibe a pontuação
            if (pontuacaoUsuarioSpan) {
                pontuacaoUsuarioSpan.textContent = dados.pontuacao || 'N/A';
            }
            if (pontuacaoTotalSpan) {
                pontuacaoTotalSpan.textContent = '22';
            }

            // Exibe as restrições e condições
            if (condicoesListUl && dados.grupo) {
                condicoesListUl.innerHTML = ''; // Limpa a lista existente
                const grupoLi = document.createElement('li');
                grupoLi.textContent = dados.grupo;
                condicoesListUl.appendChild(grupoLi);

                if (dados.alergias && dados.alergias.length > 0) {
                    dados.alergias.forEach(alergia => {
                        const li = document.createElement('li');
                        li.textContent = `Alergia a ${alergia}`;
                        condicoesListUl.appendChild(li);
                    });
                }
            }

        } catch (e) {
            console.error('Erro ao processar dados do localStorage:', e);
            if (userNameSpan) userNameSpan.textContent = 'Erro ao carregar';
            if (userEmailSpan) userEmailSpan.textContent = 'Erro ao carregar';
            if (userCpfSpan) userCpfSpan.textContent = 'Erro ao carregar';
            if (pontuacaoUsuarioSpan) pontuacaoUsuarioSpan.textContent = 'Erro';
            if (pontuacaoTotalSpan) pontuacaoTotalSpan.textContent = 'Erro';
            if (condicoesListUl) condicoesListUl.innerHTML = '<li>Erro ao carregar dados.</li>';
        }
    } else {
        // Mensagens padrão caso não haja dados no localStorage
        if (userNameSpan) userNameSpan.textContent = 'Nenhum dado encontrado.';
        if (userEmailSpan) userEmailSpan.textContent = 'Nenhum dado encontrado.';
        if (userCpfSpan) userCpfSpan.textContent = 'Nenhum dado encontrado.';
        if (pontuacaoUsuarioSpan) pontuacaoUsuarioSpan.textContent = '0';
        if (pontuacaoTotalSpan) pontuacaoTotalSpan.textContent = '22';
        if (condicoesListUl) condicoesListUl.innerHTML = '<li>Sem dados de avaliação.</li>';
    }
});