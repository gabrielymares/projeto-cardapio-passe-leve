// O restante das suas funções (toggleResposta, marcarNenhuma, mostrarCampoOutros)
// ficam exatamente como estão.

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
            // A sua lógica aqui repete o "Grupo 2", verifique se é isso mesmo que você quer
            grupoUsuario = 'Grupo 2 – Condições Intestinais';
        } else {
            // A sua lógica aqui repete o "Grupo 1", verifique se é isso mesmo que você quer
            grupoUsuario = 'Grupo 1 – Condições Metabólicas';
        }
        
        
// --- CÓDIGO PARA REDIRECIONAR E ENVIAR OS DADOS ---
const urlDeResultados = `pontuacao.html?pontos=${pontuacaoTotal}&grupo=${encodeURIComponent(grupoUsuario)}`;
 window.location.href = `../pontuacao/${urlDeResultados}`;
    });
});


 function toggleResposta(element) {
            const respostas = element.nextElementSibling;
            respostas.style.display = respostas.style.display === 'block' ? 'none' : 'block';
        }

        function marcarNenhuma(nenhumaCheckbox) {
            const checkboxes = document.querySelectorAll('input[name="' + nenhumaCheckbox.name + '"]');
            if (nenhumaCheckbox.checked) {
                checkboxes.forEach(cb => {
                    if (cb !== nenhumaCheckbox) cb.checked = false;
                });
            }
        }

        function mostrarCampoOutros(outrosCheckbox) {
            const campo = outrosCheckbox.parentElement.querySelector('.campo-outros');
            campo.style.display = outrosCheckbox.checked ? 'inline-block' : 'none';
        }
    

