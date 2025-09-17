document.addEventListener('DOMContentLoaded', () => {
    // Referência aos elementos HTML que serão atualizados
    const pontuacaoUsuarioSpan = document.getElementById('pontuacao-usuario');
    const pontuacaoTotalSpan = document.getElementById('pontuacao-total');
    const condicoesListUl = document.querySelector('.conditions-list ul');
    const semanaAtualTitulo = document.getElementById('semana-atual-titulo');
    const tasksContainerUl = document.querySelector('.tasks-container ul');

    // Mapeamento de substituições de alimentos para alergias comuns
    // Adapte esta lista conforme as necessidades do seu programa
    const substituicoes = {
        // Exemplo de intolerância à lactose
        'lactose': {
            'leite': 'leite de amêndoas',
            'iogurte': 'iogurte de coco',
            'queijo': 'queijo de castanhas'
        },
        // Exemplo de intolerância ao glúten
        'glúten': {
            'pão': 'pão sem glúten',
            'macarrão': 'macarrão de arroz ou abobrinha',
            'trigo': 'farinha de arroz'
        }
    };

    // Função para adaptar o cardápio com base nas alergias do usuário
    function adaptarCardapio(cardapioOriginal, alergiasDoUsuario) {
        if (!alergiasDoUsuario || alergiasDoUsuario.length === 0) {
            return cardapioOriginal; // Retorna o cardápio original se não houver alergias
        }

        return cardapioOriginal.map(refeicao => {
            let refeicaoAdaptada = refeicao;
            alergiasDoUsuario.forEach(alergia => {
                const alergiaLowerCase = alergia.toLowerCase();
                const mapaSub = substituicoes[alergiaLowerCase];
                
                if (mapaSub) {
                    for (const alimento in mapaSub) {
                        const regex = new RegExp(`\\b${alimento}\\b`, 'gi');
                        refeicaoAdaptada = refeicaoAdaptada.replace(regex, mapaSub[alimento]);
                    }
                }
            });
            return refeicaoAdaptada;
        });
    }

    // Define os cardápios base para cada fase do programa
    const cardapiosPorFase = {
        'introducao': {
            'domingo': ['Café da manhã: Iogurte natural com frutas', 'Almoço: Salada de folhas com frango grelhado', 'Jantar: Omelete de legumes com queijo'],
            'segunda': ['Café da manhã: Pão integral com queijo branco', 'Almoço: Arroz integral, feijão e carne magra', 'Jantar: Sopa de abóbora com gengibre'],
            'terca': ['Café da manhã: Mingau de aveia', 'Almoço: Peixe assado com batata doce', 'Jantar: Wrap de frango com vegetais'],
            'quarta': ['Café da manhã: Vitamina de banana e leite de amêndoas', 'Almoço: Salada de lentilha com legumes coloridos', 'Jantar: Frango desfiado com purê de couve-flor'],
            'quinta': ['Café da manhã: Ovos mexidos com tomate e orégano', 'Almoço: Quibe assado com salada de pepino', 'Jantar: Sopa de legumes com croutons integrais'],
            'sexta': ['Café da manhã: Panqueca de banana e aveia', 'Almoço: Salmão grelhado com quinoa e brócolis', 'Jantar: Sopa de feijão com carne desfiada'],
            'sabado': ['Café da manhã: Frutas variadas e castanhas', 'Almoço: Macarrão integral com molho de tomate caseiro', 'Jantar: Salada de atum com grão de bico']
        },
        'adaptacao': {
            'domingo': ['Café da manhã: Omelete com legumes e queijo', 'Almoço: Bife grelhado, arroz integral e salada', 'Jantar: Salada de frango com abacate'],
            'segunda': ['Café da manhã: Panqueca de aveia com morangos', 'Almoço: Salmão assado com purê de abóbora', 'Jantar: Sopa de mandioquinha'],
            'terca': ['Café da manhã: Iogurte grego com granola caseira', 'Almoço: Frango ao curry com arroz basmati', 'Jantar: Wraps de alface recheados com carne moída'],
            'quarta': ['Café da manhã: Ovos mexidos com abacate', 'Almoço: Espaguete de abobrinha com molho bolonhesa', 'Jantar: Sopa de lentilha com gengibre'],
            'quinta': ['Café da manhã: Pão sem glúten com ovos e tomate', 'Almoço: Salada de quinoa com legumes e queijo', 'Jantar: Bife de patinho com brócolis cozido'],
            'sexta': ['Café da manhã: Vitamina de frutas vermelhas e proteína', 'Almoço: Frango xadrez fit com arroz integral', 'Jantar: Sopa cremosa de legumes com frango'],
            'sabado': ['Café da manhã: Tapioca com recheio de frango e requeijão', 'Almoço: Filé de peixe em crosta de castanhas com salada', 'Jantar: Salada de atum com ovos e azeitonas']
        },
        'desafios': { /* Preencha aqui com os cardápios da fase 'desafios' */ },
        'consolidacao': { /* Preencha aqui com os cardápios da fase 'consolidacao' */ }
    };

    // Tenta carregar os dados da última avaliação do localStorage
    const dadosSalvos = localStorage.getItem('ultimaAvaliacao');

    // Restante do código (lógica de carregamento e exibição)
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            // === Lógica de exibição da PONTUAÇÃO E CONDIÇÕES ===
            if (pontuacaoUsuarioSpan) {
                pontuacaoUsuarioSpan.textContent = dados.pontuacao || 'N/A';
            }
            if (pontuacaoTotalSpan) {
                pontuacaoTotalSpan.textContent = '22';
            }

            if (condicoesListUl && dados.grupo) {
                condicoesListUl.innerHTML = '';
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
            
            // === Lógica de cálculo da SEMANA ATUAL e EXIBIÇÃO DO CARDÁPIO ===
            if (semanaAtualTitulo && dados.dataInicio) {
                const dataInicio = new Date(dados.dataInicio);
                const dataAtual = new Date();
                
                const diferencaEmMilissegundos = dataAtual.getTime() - dataInicio.getTime();
                const diasPassados = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
                
                let semanaAtual = Math.floor(diasPassados / 7) + 1;
                semanaAtual = Math.min(semanaAtual, 12);

                let faseDoPrograma = '';
                if (semanaAtual >= 1 && semanaAtual <= 3) {
                    semanaAtualTitulo.textContent = `Semana ${semanaAtual} - INTRODUÇÃO`;
                    faseDoPrograma = 'introducao';
                } else if (semanaAtual >= 4 && semanaAtual <= 6) {
                    semanaAtualTitulo.textContent = `Semana ${semanaAtual} - ADAPTAÇÃO`;
                    faseDoPrograma = 'adaptacao';
                } else if (semanaAtual >= 7 && semanaAtual <= 9) {
                    semanaAtualTitulo.textContent = `Semana ${semanaAtual} - DESAFIOS`;
                    faseDoPrograma = 'desafios';
                } else if (semanaAtual >= 10 && semanaAtual <= 12) {
                    semanaAtualTitulo.textContent = `Semana ${semanaAtual} - CONSOLIDAÇÃO`;
                    faseDoPrograma = 'consolidacao';
                } else {
                    semanaAtualTitulo.textContent = `Parabéns! Você concluiu o programa de 12 semanas.`;
                    faseDoPrograma = 'consolidacao';
                }
                
                // Exibir o cardápio diário com base na fase e no dia da semana
                if (tasksContainerUl) {
                    const diasDaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
                    const hoje = diasDaSemana[dataAtual.getDay()];
                    
                    const cardapioBase = cardapiosPorFase[faseDoPrograma] ? cardapiosPorFase[faseDoPrograma][hoje] : null;

                    if (cardapioBase) {
                        const alergias = dados.alergias || [];
                        const cardapioPersonalizado = adaptarCardapio(cardapioBase, alergias);

                        tasksContainerUl.innerHTML = '';
                        cardapioPersonalizado.forEach(refeicao => {
                            const li = document.createElement('li');
                            const span = document.createElement('span');
                            span.textContent = refeicao;
                            li.appendChild(span);
                            tasksContainerUl.appendChild(li);
                        });
                    } else {
                        tasksContainerUl.innerHTML = '<li>Cardápio não disponível para esta fase.</li>';
                    }
                }

            } else {
                semanaAtualTitulo.textContent = `Programa não iniciado`;
            }

        } catch (e) {
            console.error('Erro ao processar dados do localStorage:', e);
            if (semanaAtualTitulo) semanaAtualTitulo.textContent = `Erro ao carregar semana`;
            if (pontuacaoUsuarioSpan) pontuacaoUsuarioSpan.textContent = `Erro`;
            if (pontuacaoTotalSpan) pontuacaoTotalSpan.textContent = `Erro`;
            if (condicoesListUl) condicoesListUl.innerHTML = `<li>Erro ao carregar dados.</li>`;
            if (tasksContainerUl) tasksContainerUl.innerHTML = `<li>Erro ao carregar cardápio.</li>`;
        }
    } else {
        // Mensagens padrão caso não haja dados no localStorage
        if (semanaAtualTitulo) semanaAtualTitulo.textContent = `Bem-vindo ao Programa de Adaptação!`;
        if (pontuacaoUsuarioSpan) pontuacaoUsuarioSpan.textContent = `0`;
        if (pontuacaoTotalSpan) pontuacaoTotalSpan.textContent = `22`;
        if (condicoesListUl) condicoesListUl.innerHTML = `<li>Sem dados de avaliação.</li>`;
        if (tasksContainerUl) tasksContainerUl.innerHTML = `<li>Para começar, faça a sua avaliação.</li>`;
        console.log('Nenhum dado de avaliação encontrado no localStorage.');
    }
});