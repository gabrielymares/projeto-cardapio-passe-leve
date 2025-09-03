function toggleResposta(element) {
    let respostas = element.nextElementSibling;
    let seta = element.querySelector("span");

    if (respostas.style.display === "block") {
        respostas.style.display = "none";
        seta.textContent = "▼";
    } else {
        respostas.style.display = "block";
        seta.textContent = "▲";
    }
}

// Lógica para "Nenhuma" (agora unificada)
function marcarNenhuma(nenhumaCheckbox) {
    const name = nenhumaCheckbox.name;
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    if (nenhumaCheckbox.checked) {
        checkboxes.forEach(cb => {
            if (cb !== nenhumaCheckbox) cb.checked = false;
        });
    }
}

// Mostrar campo de texto para "Outros" (agora unificado)
function mostrarCampoOutros(outrosCheckbox) {
    const campo = outrosCheckbox.parentElement.querySelector('.campo-outros');
    if (campo) {
        campo.style.display = outrosCheckbox.checked ? 'inline-block' : 'none';
    }
}

// --- NOVAS FUNÇÕES DE CLASSIFICAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    const botaoEnviar = document.querySelector('button');
    botaoEnviar.addEventListener('click', (event) => {
        event.preventDefault(); // Impede o envio do formulário para o servidor

        let pontuacaoTotal = 0;
        let temCondicaoIntestinal = false;
        let temCondicaoMetabolica = false;

        // 1. Coletar e pontuar as respostas de rádio
        const alimentacao = document.querySelector('input[name="p1"]:checked')?.nextSibling.textContent.trim();
        const habitos = document.querySelector('input[name="p3"]:checked')?.nextSibling.textContent.trim();

        if (alimentacao === 'Sim') pontuacaoTotal += 20;
        else if (alimentacao === 'Mais ou Menos') pontuacaoTotal += 10;
        else if (alimentacao === 'Não') pontuacaoTotal -= 5;

        if (habitos === 'Sim') pontuacaoTotal += 20;
        else if (habitos === 'Não') pontuacaoTotal -= 5;

        // 2. Coletar as respostas de checkbox e verificar condições específicas
        const alergias = Array.from(document.querySelectorAll('input[name="alergia"]:checked')).map(cb => cb.value);
        const restricoes = Array.from(document.querySelectorAll('input[name="restricao"]:checked')).map(cb => cb.value);

        // Verifica as condições intestinais e metabólicas
        if (alergias.includes('leite') || alergias.includes('gluten')) {
            temCondicaoIntestinal = true;
        }

        if (restricoes.includes('gluten') || restricoes.includes('diabetes') || restricoes.includes('hipertensao')) {
            temCondicaoMetabolica = true;
        }

        // 3. Lógica de Classificação Final
        let grupoUsuario = '';

        if (temCondicaoIntestinal) {
            grupoUsuario = 'Grupo 2 – Condições Intestinais';
        } else if (temCondicaoMetabolica) {
            grupoUsuario = 'Grupo 1 – Condições Metabólicas';
        } else if (pontuacaoTotal >= 36) {
            grupoUsuario = 'Grupo 3 – Estilo de Vida Saudável';
        } else if (pontuacaoTotal >= 21) {
            grupoUsuario = 'Grupo 2 – Condições Intestinais';
        } else {
            grupoUsuario = 'Grupo 1 – Condições Metabólicas';
        }
        
        // Exibição do resultado (você pode adaptar isso)
        document.getElementById('grupo-resultado').textContent = grupoUsuario;
    });
});