document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dataForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const sexo = document.getElementById('sexo').value;
        const imc = document.getElementById('imc').value;
        
        if (nome && idade && sexo && imc) {
            console.log('Dados submetidos:');
            console.log('Nome:', nome);
            console.log('Idade:', idade);
            console.log('Sexo:', sexo);
            console.log('IMC:', imc);
            
            alert('Dados confirmados com sucesso!');
            
            // 🔽 redireciona só depois da validação
            window.location.href = "../avaliacao/avaliacao.html";
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
});
