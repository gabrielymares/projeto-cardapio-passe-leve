document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-avaliacao');

    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validarFormulario()) return;

        const reverterLoading = mostrarLoading();

        // ===== COLETAR DADOS =====
        let pontuacaoTotal = 0;
        let temCondicaoIntestinal = false;
        let temCondicaoMetabolica = false;

        const alimentacaoElement = document.querySelector('input[name="p1"]:checked');
        const habitosElement = document.querySelector('input[name="p3"]:checked');

        pontuacaoTotal += parseInt(alimentacaoElement.value);
        pontuacaoTotal += parseInt(habitosElement.value);

        const alergias = Array.from(document.querySelectorAll('input[name="alergia"]:checked')).map(cb => cb.value);
        const restricoes = Array.from(document.querySelectorAll('input[name="restricao"]:checked')).map(cb => cb.value);

        if (alergias.includes('leite') || alergias.includes('gluten')) temCondicaoIntestinal = true;
        if (restricoes.includes('gluten') || restricoes.includes('diabetes') || restricoes.includes('hipertensao')) temCondicaoMetabolica = true;

        // ===== CLASSIFICAÇÃO =====
        let grupoUsuario = '';

        if (temCondicaoIntestinal) {
            grupoUsuario = 'Grupo 2 – Condições Intestinais';
        } else if (temCondicaoMetabolica) {
            grupoUsuario = 'Grupo 1 – Condições Metabólicas';
        } else if (pontuacaoTotal >= 15) {
            grupoUsuario = 'Grupo 3 – Estilo de Vida Saudável';
        } else if (pontuacaoTotal >= 10) {
            grupoUsuario = 'Grupo 2 – Condições Intestinais';
        } else {
            grupoUsuario = 'Grupo 1 – Condições Metabólicas';
        }

        const alergiaOutros = document.querySelector('input[name="alergia_outros"]')?.value || '';
        const restricaoOutros = document.querySelector('input[name="restricao_outros"]')?.value || '';

        const dadosCompletos = {
            pontuacao: pontuacaoTotal,
            grupo: grupoUsuario,
            alergias: alergias.filter(a => a !== 'nenhuma'),
            restricoes: restricoes.filter(r => r !== 'nenhuma'),
            alergiaOutros,
            restricaoOutros,
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem('resultadoAvaliacao', JSON.stringify(dadosCompletos));

        // Redirecionamento
        setTimeout(() => {
            window.location.href = "../pontuacao/pontuacao.html";
        }, 500);
    });
});

// ===== FUNÇÕES AUXILIARES =====
function toggleResposta(element) {
    const respostas = element.nextElementSibling;
    respostas.style.display = respostas.style.display === 'block' ? 'none' : 'block';
}

function marcarNenhuma(nenhumaCheckbox) {
    const checkboxes = document.querySelectorAll('input[name="' + nenhumaCheckbox.name + '"]');
    if (nenhumaCheckbox.checked) {
        checkboxes.forEach(cb => { if (cb !== nenhumaCheckbox) cb.checked = false; });
    }
}

function mostrarCampoOutros(outrosCheckbox) {
    const campo = outrosCheckbox.parentElement.querySelector('.campo-outros');
    campo.style.display = outrosCheckbox.checked ? 'inline-block' : 'none';
    if (outrosCheckbox.checked) campo.focus();
}

// ===== FUNÇÕES DE VALIDAÇÃO E FEEDBACK =====
function validarFormulario() {
    const perguntas = [
        { name: 'p1', label: 'alimentação saudável' },
        { name: 'p3', label: 'hábitos de saúde' }
    ];

    for (let pergunta of perguntas) {
        if (!document.querySelector(`input[name="${pergunta.name}"]:checked`)) {
            alert(`Por favor, responda sobre sua ${pergunta.label}`);
            return false;
        }
    }

    if (!document.querySelector('input[name="alergia"]:checked') ||
        !document.querySelector('input[name="restricao"]:checked')) {
        alert('Por favor, marque suas alergias e restrições (pode ser "Nenhuma")');
        return false;
    }

    const outrosCheckboxes = document.querySelectorAll('input[value="outros"]:checked');
    for (let cb of outrosCheckboxes) {
        const campoTexto = cb.parentElement.querySelector('.campo-outros');
        if (!campoTexto.value.trim()) {
            alert('Por favor, especifique o campo "Outros"');
            campoTexto.focus();
            return false;
        }
    }

    return true;
}

function mostrarLoading() {
    const botao = document.querySelector('button[type="submit"]');
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = 'Processando... ⏳';
    botao.disabled = true;
    botao.style.opacity = '0.7';
    return () => {
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
        botao.style.opacity = '1';
    };
}
