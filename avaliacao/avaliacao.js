// ============================================
// FUNÇÕES AUXILIARES PARA SALVAR NO ARRAY DE CLIENTES
// ============================================

function montarRestricoes(avaliacao) {
    const restricoes = [];
    
    if (avaliacao.p1_doenca === 'sim' && avaliacao.p1_doenca_outros) {
        restricoes.push(`Doença: ${avaliacao.p1_doenca_outros}`);
    }
    
    if (avaliacao.p2_alergia && avaliacao.p2_alergia.length > 0) {
        let alergias = avaliacao.p2_alergia.filter(a => a !== 'nenhuma');
        
        const indexOutros = alergias.indexOf('outros');
        if (indexOutros > -1) {
            alergias.splice(indexOutros, 1);
        }
        
        if (alergias.length > 0) {
            restricoes.push(`Alergias: ${alergias.join(', ')}`);
        }
    }
    
    if (avaliacao.p2_alergia_outros) {
        restricoes.push(`Outras alergias: ${avaliacao.p2_alergia_outros}`);
    }
    
    if (avaliacao.p3_restricao === 'sim' && avaliacao.p3_restricao_outros) {
        restricoes.push(`Restrição médica: ${avaliacao.p3_restricao_outros}`);
    }
    
    if (avaliacao.p8_alimentos_evita) {
        restricoes.push(`Evita: ${avaliacao.p8_alimentos_evita}`);
    }
    
    return restricoes.length > 0 ? restricoes.join('\n') : 'Nenhuma restrição informada';
}

function montarSaude(avaliacao) {
    const saude = [];
    
    if (avaliacao.p4_exercicio) {
        const exercicioMap = {
            'diariamente': 'Exercita-se diariamente',
            'algumas_vezes': 'Exercita-se 1-3 vezes/semana',
            'raramente': 'Raramente exercita-se'
        };
        saude.push(exercicioMap[avaliacao.p4_exercicio] || avaliacao.p4_exercicio);
    }
    
    if (avaliacao.p5_apetite) {
        saude.push(`Apetite: ${avaliacao.p5_apetite}`);
    }
    
    if (avaliacao.p6_objetivo && avaliacao.p6_objetivo.length > 0) {
        const objetivos = avaliacao.p6_objetivo.map(obj => {
            const map = {
                'emagrecer': 'Emagrecer',
                'ganhar_peso': 'Ganhar peso',
                'ganhar_massa': 'Ganhar massa muscular',
                'manter_peso': 'Manter peso',
                'melhorar_saude': 'Melhorar saúde/energia'
            };
            return map[obj] || obj;
        });
        saude.push(`Objetivos: ${objetivos.join(', ')}`);
    }
    
    if (avaliacao.p7_refeicoes) {
        const refeicoesMap = {
            '2_ou_menos': '2 ou menos refeições/dia',
            '3_ou_4': '3 a 4 refeições/dia',
            '5_ou_mais': '5 ou mais refeições/dia'
        };
        saude.push(refeicoesMap[avaliacao.p7_refeicoes] || avaliacao.p7_refeicoes);
    }
    
    if (avaliacao.p9_frequencia) {
        saude.push(`Consome frequentemente: ${avaliacao.p9_frequencia}`);
    }
    
    if (avaliacao.p10_emocional) {
        const emocionalMap = {
            'sempre': 'Sempre tem fome emocional',
            'as_vezes': 'Às vezes tem fome emocional',
            'nunca': 'Não tem fome emocional'
        };
        saude.push(emocionalMap[avaliacao.p10_emocional] || avaliacao.p10_emocional);
    }
    
    if (avaliacao.grupo) {
        saude.push(`\n${avaliacao.grupo}`);
    }
    
    if (avaliacao.pontuacao !== undefined) {
        saude.push(`Pontuação: ${avaliacao.pontuacao}/50`);
    }
    
    return saude.length > 0 ? saude.join('\n') : 'Informações não disponíveis';
}

function salvarClienteNoArray(dadosUsuario, avaliacaoCompleta) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    const novoCliente = {
        nome: dadosUsuario.nome || 'Sem nome',
        genero: dadosUsuario.sexo || 'Não informado',
        altura: dadosUsuario.altura || '0',
        idade: dadosUsuario.idade || '0',
        peso: dadosUsuario.peso || '0',
        telefone: dadosUsuario.contato || 'Não informado',
        imc: dadosUsuario.imc || '0',
        restricoes: montarRestricoes(avaliacaoCompleta),
        saude: montarSaude(avaliacaoCompleta),
        dataCadastro: dadosUsuario.dataInicio || new Date().toISOString(),
        grupo: avaliacaoCompleta.grupo || 'Não definido',
        pontuacao: avaliacaoCompleta.pontuacao || 0
    };
    
    clientes.push(novoCliente);
    
    localStorage.setItem('clientes', JSON.stringify(clientes));
    
    console.log(`✅ Cliente "${novoCliente.nome}" adicionado! Total de clientes: ${clientes.length}`);
    
    return clientes.length - 1;
}

// ============================================
// FUNÇÕES DE INTERAÇÃO DO FORMULÁRIO
// ============================================

function abrirAba(evt, nomeAba) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.getElementById(nomeAba).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function toggleResposta(element) {
    const respostas = element.nextElementSibling;
    respostas.classList.toggle('active');
    element.classList.toggle('active');
}

// CORREÇÃO PRINCIPAL: Inicializa eventos dos checkboxes de alergia (P2)
function inicializarCheckboxesAlergia() {
    const checkboxes = document.querySelectorAll('input[name="p2_alergia"]');
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.value === 'nenhuma') {
                marcarNenhuma(this);
            } else if (this.value !== 'nenhuma') {
                // Se marca qualquer coisa que não é "nenhuma", desmarca nenhuma
                const parent = this.closest('.respostas');
                const cbNenhuma = parent.querySelector('input[name="p2_alergia"][value="nenhuma"]');
                if (this.checked && cbNenhuma && cbNenhuma.checked) {
                    cbNenhuma.checked = false;
                }
                
                // Se marca 'outros', mostra o campo
                if (this.value === 'outros' && this.checked) {
                    mostrarCampoOutros(this);
                } else if (this.value === 'outros' && !this.checked) {
                    // Se desmarcar 'outros', esconde o campo
                    const parent = this.closest('.respostas');
                    const campoOutros = parent.querySelector('input[name="p2_outros"]');
                    if (campoOutros) {
                        campoOutros.style.display = 'none';
                        campoOutros.value = '';
                    }
                }
            }
        });
    });
}

function marcarNenhuma(cb) {
    const parent = cb.closest('.respostas');
    
    if (cb.value === 'nenhuma' && cb.checked) {
        // Quando marca "nenhuma", desmarca tudo e esconde o campo
        const campoOutros = parent.querySelector('input[name="p2_outros"]');
        
        if (campoOutros) {
            campoOutros.style.display = 'none';
            campoOutros.value = '';
        }
        
        // Desmarca TODOS os outros checkboxes
        parent.querySelectorAll('input[name="p2_alergia"]').forEach(i => {
            if (i.value !== 'nenhuma') {
                i.checked = false;
            }
        });
    }
}

// FUNÇÃO CORRIGIDA: Mostra campo de texto para P1, P2 e P3
function mostrarCampoOutros(element) {
    const name = element.name;
    const parent = element.closest('.respostas');
    
    let campoOutrosName = '';
    
    if (name === 'p1_doenca') {
        campoOutrosName = 'p1_outros';
    } else if (name === 'p2_alergia') {
        campoOutrosName = 'p2_outros';
    } else if (name === 'p3_restricao') {
        campoOutrosName = 'p3_outros';
    }
    
    const campoOutros = parent.querySelector(`input[name="${campoOutrosName}"]`);
    
    if (!campoOutros) return;

    let shouldShow = false;
    
    if (element.type === 'radio') {
        // Para P1 e P3 (Radio buttons): Mostrar se "sim" for selecionado
        shouldShow = (element.value === 'sim');
        
        if (!shouldShow) {
            campoOutros.style.display = 'none';
            campoOutros.value = '';
            return; 
        }

    } else if (element.type === 'checkbox' && element.value === 'outros') {
        // Para P2 (Checkbox 'outros')
        shouldShow = element.checked;
    }
    
    // Aplica a visibilidade
    if (shouldShow) {
        campoOutros.style.display = 'inline-block';
        campoOutros.focus();
    } else {
        campoOutros.style.display = 'none';
        campoOutros.value = '';
    }
}

function validarFormulario() {
    const perguntasObrigatorias = [
        'p1_doenca', 'p3_restricao', 'p4_exercicio', 'p5_apetite', 'p7_refeicoes', 'p10_emocional'
    ];
    let todosRadiosPreenchidos = true;

    // 1. Validar Rádios Obrigatórios
    for (const name of perguntasObrigatorias) {
        if (!document.querySelector(`input[name="${name}"]:checked`)) {
            alert('Por favor, responda todas as perguntas de escolha única.');
            todosRadiosPreenchidos = false;
            break;
        }
    }
    if (!todosRadiosPreenchidos) return false;

    // 2. Validar Checkbox (Objetivo - Q10)
    if (document.querySelectorAll('input[name="p6_objetivo"]:checked').length === 0) {
        alert('Por favor, selecione pelo menos um objetivo (Pergunta 10).');
        return false;
    }

    // 3. Validar Campos 'Outros' (Q1, Q2, Q3)
    const camposOutros = [
        { trigger: 'input[name="p1_doenca"][value="sim"]:checked', field: 'input[name="p1_outros"]' },
        { trigger: 'input[name="p2_alergia"][value="outros"]:checked', field: 'input[name="p2_outros"]' },
        { trigger: 'input[name="p3_restricao"][value="sim"]:checked', field: 'input[name="p3_outros"]' }
    ];

    for (const item of camposOutros) {
        if (document.querySelector(item.trigger)) {
            const campo = document.querySelector(item.field);
            if (!campo.value.trim()) {
                alert('Preencha o campo de especificação para sua resposta "Sim" ou "Outros".');
                campo.focus();
                return false;
            }
        }
    }

    // 4. Validar Checkbox Alergia (Q2)
    if (document.querySelectorAll('input[name="p2_alergia"]:checked').length === 0) {
        alert('Por favor, marque pelo menos uma opção para a pergunta de alergia/intolerância (Pergunta 2).');
        return false;
    }

    return true;
}

function mostrarLoading() {
    const botao = document.querySelector('#formulario-avaliacao button[type="submit"]');
    const texto = botao.innerHTML;
    botao.innerHTML = 'Processando... ⏳';
    botao.disabled = true;
    botao.style.opacity = '0.7';
    return () => { botao.innerHTML = texto; botao.disabled = false; botao.style.opacity = '1'; };
}

// ============================================
// CÓDIGO PRINCIPAL DO FORMULÁRIO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // INICIALIZAÇÃO: Configura os checkboxes de alergia
    inicializarCheckboxesAlergia();

    const formulario = document.getElementById('formulario-avaliacao');

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        const reverter = mostrarLoading();

        // 1. DADOS E PONTUAÇÃO
        let pontuacaoTotal = 0;
        let temAlergiaIntestinal = false;
        let temRestricaoMetabolica = false;

        const respostasPontuadas = {
            p1_doenca: { 'nao': 10, 'sim': 0 },
            p4_exercicio: { 'diariamente': 10, 'algumas_vezes': 5, 'raramente': 0 },
            p5_apetite: { 'normal': 10, 'baixo': 0, 'aumentado': 0 },
            p7_refeicoes: { '3_ou_4': 10, '2_ou_menos': 0, '5_ou_mais': 0 },
            p10_emocional: { 'nunca': 10, 'as_vezes': 5, 'sempre': 0 }
        };

        Object.keys(respostasPontuadas).forEach(name => {
            const resposta = document.querySelector(`input[name="${name}"]:checked`)?.value;
            if (resposta) {
                pontuacaoTotal += respostasPontuadas[name][resposta] || 0;
            }
        });

        // 2. CLASSIFICAÇÃO EM GRUPOS
        
        const alergias = Array.from(document.querySelectorAll('input[name="p2_alergia"]:checked')).map(cb => cb.value);
        if (alergias.includes('lactose') || alergias.includes('gluten') || alergias.includes('outros')) {
            temAlergiaIntestinal = true;
        }

        const restricaoTexto = document.querySelector('input[name="p3_restricao"][value="sim"]:checked')
            ? (document.querySelector('input[name="p3_outros"]')?.value.toLowerCase() || '')
            : '';
        const doencaTexto = document.querySelector('input[name="p1_doenca"][value="sim"]:checked')
            ? (document.querySelector('input[name="p1_outros"]')?.value.toLowerCase() || '')
            : '';

        const indicativosMetabolicos = ['diabetes', 'hipertensão', 'hipertenso', 'colesterol', 'renal'];
        
        if (indicativosMetabolicos.some(cond => restricaoTexto.includes(cond) || doencaTexto.includes(cond))) {
            temRestricaoMetabolica = true;
        }

        let grupo = '';
        if (temAlergiaIntestinal) {
            grupo = 'Grupo 2 – Condições Intestinais';
        } else if (temRestricaoMetabolica) {
            grupo = 'Grupo 1 – Condições Metabólicas';
        } else if (pontuacaoTotal >= 40) {
            grupo = 'Grupo 3 – Estilo de Vida Saudável';
        } else if (pontuacaoTotal >= 25) {
            grupo = 'Grupo 2 – Condições Intestinais';
        } else {
            grupo = 'Grupo 1 – Condições Metabólicas';
        }
        
        // 3. COLETAR DADOS COMPLETOS E SALVAR
        
        const dadosCompletos = {
            pontuacao: pontuacaoTotal,
            grupo: grupo,
            
            p1_doenca: document.querySelector('input[name="p1_doenca"]:checked')?.value || 'nao_respondeu',
            p1_doenca_outros: doencaTexto,
            p2_alergia: alergias.filter(v => v !== 'nenhuma'),
            p2_alergia_outros: document.querySelector('input[name="p2_outros"]')?.value || '',
            p3_restricao: document.querySelector('input[name="p3_restricao"]:checked')?.value || 'nao_respondeu',
            p3_restricao_outros: restricaoTexto,
            p4_exercicio: document.querySelector('input[name="p4_exercicio"]:checked')?.value || 'nao_respondeu',
            p5_apetite: document.querySelector('input[name="p5_apetite"]:checked')?.value || 'nao_respondeu',
            p6_objetivo: Array.from(document.querySelectorAll('input[name="p6_objetivo"]:checked')).map(cb => cb.value),
            p7_refeicoes: document.querySelector('input[name="p7_refeicoes"]:checked')?.value || 'nao_respondeu',
            p8_alimentos_evita: document.querySelector('textarea[name="p8_alimentos_evita"]')?.value || '',
            p9_frequencia: document.querySelector('textarea[name="p9_frequencia"]')?.value || '',
            p10_emocional: document.querySelector('input[name="p10_emocional"]:checked')?.value || 'nao_respondeu',
            
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem('resultadoAvaliacao', JSON.stringify(dadosCompletos));
        localStorage.setItem('ultimaAvaliacao', JSON.stringify(dadosCompletos));

        const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario')) || {};
        salvarClienteNoArray(dadosUsuario, dadosCompletos);

        setTimeout(() => {
            reverter();
            window.location.href = "../pontuacao/pontuacao.html";
        }, 500);
    });
});