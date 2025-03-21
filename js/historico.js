document.addEventListener('DOMContentLoaded', function() {
    const historicoTabela = document.getElementById('historico-tabela');
    const clearHistoryBtn = document.getElementById('clear-history');

    // Função para carregar o histórico
    function carregarHistorico() {
        const historico = JSON.parse(sessionStorage.getItem('historico_cnpjs')) || [];
        historicoTabela.innerHTML = ''; // Limpa a tabela antes de renderizar
        historico.forEach(entry => {
            const tr = document.createElement('tr');
            const tdCnpj = document.createElement('td');
            const tdRSocial = document.createElement('td');
            const tdData = document.createElement('td');

            tdCnpj.textContent = entry.cnpj;
            tdRSocial.textContent = entry.rsocial; // Correção aqui
            tdData.textContent = entry.data;

            tr.appendChild(tdCnpj);
            tr.appendChild(tdRSocial);
            tr.appendChild(tdData);
            historicoTabela.appendChild(tr);
        });
    }

    // Função para limpar o histórico
    function limparHistorico() {
        sessionStorage.removeItem('historico_cnpjs');
        carregarHistorico(); // Atualiza a tabela após limpar
    }

    // Configura o botão para limpar o histórico
    clearHistoryBtn.addEventListener('click', limparHistorico);

    // Carrega o histórico ao iniciar
    carregarHistorico();
});
