// Função chamada ao pressionar o botão de consulta
function callcnpj(cnpj) {
    $.ajax({
        url: 'https://receitaws.com.br/v1/cnpj/' + cnpj.replace(/[^0-9]/g, ''),
        type: "GET",
        dataType: 'jsonp',
        success: function(data) {
            if (data.nome === undefined) {
                console.log("Dados não disponíveis");
            } else {
                const situacaoEl = document.getElementById('situacao');
                const dataSituacaoEl = document.getElementById('data-situacao');
                const statusEl = document.getElementById('status');
                const ultimaAtualizacaoEl = document.getElementById('ultima-atualizacao');
                const cnpjCampoEl = document.getElementById('cnpj-campo');
                const razaoSocialEl = document.getElementById('razao-social');
                const nomeFantasiaEl = document.getElementById('nome-fantasia');
                const telefoneEl = document.getElementById('telefone');
                const logradouroEl = document.getElementById('logradouro');
                const bairroEl = document.getElementById('bairro');
                const numeroEl = document.getElementById('numero');
                const municipioEl = document.getElementById('municipio');
                const cepEl = document.getElementById('cep');
                const ufEl = document.getElementById('uf');
                const atividadePrincipalEl = document.getElementById('atividade-principal');
                const atividadesSecundariasEl = document.getElementById('atividades-secundarias');
                const membrosEl = document.getElementById('membros');
                const retornoCruEl = document.getElementById('retorno-cru');

                if (situacaoEl && dataSituacaoEl && statusEl && ultimaAtualizacaoEl && cnpjCampoEl && razaoSocialEl && nomeFantasiaEl && telefoneEl && logradouroEl && bairroEl && numeroEl && municipioEl && cepEl && ufEl && atividadePrincipalEl && atividadesSecundariasEl && membrosEl && retornoCruEl) {
                    situacaoEl.textContent = data.situacao;
                    dataSituacaoEl.textContent = data.data_situacao + " (" + (new Date().getFullYear() - data.data_situacao.split('/')[2]) + " anos )";
                    dataSituacaoEl.className = "badge bg-light text-dark";

                    if (data.situacao === "ATIVA") {
                        situacaoEl.className = "badge bg-success";
                    } else {
                        situacaoEl.className = "badge bg-warning";
                    }

                    statusEl.textContent = data.status;
                    if (data.status === "OK") {
                        statusEl.className = "badge bg-success";
                    } else {
                        statusEl.className = "badge bg-warning";
                    }

                    cnpjCampoEl.value = data.cnpj;
                    ultimaAtualizacaoEl.textContent = "Última Atualização: " + data.ultima_atualizacao;
                    ultimaAtualizacaoEl.classList.remove("placeholder", "col-7");
                    ultimaAtualizacaoEl.className = "badge bg-light text-dark";

                    razaoSocialEl.value = data.nome;
                    nomeFantasiaEl.value = data.fantasia;
                    telefoneEl.value = data.telefone;
                    logradouroEl.value = data.logradouro;
                    bairroEl.value = data.bairro;
                    numeroEl.value = data.numero;
                    municipioEl.value = data.municipio;
                    cepEl.value = data.cep;
                    ufEl.value = data.uf;

                    atividadePrincipalEl.innerHTML = '';
                    data.atividade_principal.forEach(atividade => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = `${atividade.code} - ${atividade.text}`;
                        atividadePrincipalEl.appendChild(li);
                    });

                    atividadesSecundariasEl.innerHTML = '';
                    data.atividades_secundarias.forEach(atividade => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = `${atividade.code} - ${atividade.text}`;
                        atividadesSecundariasEl.appendChild(li);
                    });

                    membrosEl.innerHTML = '';
                    data.qsa.forEach(socio => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = `${socio.nome} (${socio.qual})`;
                        membrosEl.appendChild(li);
                    });

                    retornoCruEl.textContent = JSON.stringify(data, null, 2);

                    // Atualiza o histórico na sessão
                    let historico = JSON.parse(localStorage.getItem('historico_cnpjs')) || [];
                    historico.unshift({ cnpj: data.cnpj, rsocial: data.nome, data: new Date().toLocaleDateString() });
                    localStorage.setItem('historico_cnpjs', JSON.stringify(historico));
                } else {
                    console.error('Um ou mais elementos DOM não foram encontrados.');
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Erro na consulta: ', textStatus, errorThrown);
        }
    });
}

// Adiciona o evento keypress ao campo de CNPJ
var input = document.getElementById("cnpj");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("consultar").click();
    }
});
