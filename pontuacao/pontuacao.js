document.addEventListener('DOMContentLoaded', () => {
  // Pega todos os parâmetros da URL
  const params = new URLSearchParams(window.location.search);

  // Extrai o valor de 'pontos' e 'grupo'
  const pontuacao = params.get('pontos');
  const grupo = params.get('grupo');

  // Encontra os elementos na página para exibir os dados
  const elementoPontuacao = document.getElementById('pontuacao-final');
  const elementoGrupo = document.getElementById('grupo-do-usuario');

  // Coloca os valores extraídos nos elementos da página
  if (pontuacao && grupo) {
    elementoPontuacao.textContent = pontuacao;
    elementoGrupo.textContent = grupo;
  }
});