// Função chamada ao pressionar o botão de consulta
        function callcnpj(cnpj) {
            const cnpjLimpo = cnpj.replace(/[^0-9]/g, '');
            
            // Validação básica do CNPJ
            if (cnpjLimpo.length !== 14) {
                alert('CNPJ deve ter 14 dígitos');
                return;
            }

            // Mostra loading
            const loadingSpinner = document.getElementById('loading-spinner');
            const btnText = document.getElementById('btn-text');
            const consultarBtn = document.getElementById('consultar');
            
            loadingSpinner.classList.remove('d-none');
            btnText.textContent = 'Consultando...';
            consultarBtn.disabled = true;

            // Limpa campos anteriores
            limparCampos();

            fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    preencherCampos(data);
                    salvarHistorico(data);
                })
                .catch(error => {
                    console.error('Erro na consulta:', error);
                    document.getElementById('status').textContent = 'ERRO';
                    document.getElementById('status').className = 'badge bg-danger';
                    alert('Erro ao consultar CNPJ. Verifique se o número está correto.');
                })
                .finally(() => {
                    // Remove loading
                    loadingSpinner.classList.add('d-none');
                    btnText.textContent = 'Consultar';
                    consultarBtn.disabled = false;
                });
        }

        function limparCampos() {
            const campos = [
                'situacao', 'data-situacao', 'status', 'ultima-atualizacao',
                'cnpj-campo', 'razao-social', 'nome-fantasia', 'telefone',
                'natureza-juridica', 'porte', 'logradouro', 'bairro', 'numero',
                'complemento', 'municipio', 'uf', 'cep', 'email'
            ];
            
            campos.forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    if (elemento.tagName === 'INPUT') {
                        elemento.value = '';
                    } else {
                        elemento.textContent = '';
                        elemento.className = 'placeholder col-1';
                    }
                }
            });

            // Limpa listas
            document.getElementById('membros').innerHTML = '';
            document.getElementById('atividade-principal').innerHTML = '';
            document.getElementById('atividades-secundarias').innerHTML = '';
            document.getElementById('retorno-cru').textContent = '';
            
            // Limpa informações adicionais
            limparInformacoesAdicionais();
        }

        function preencherCampos(data) {
            // Status da consulta
            document.getElementById('status').textContent = 'OK';
            document.getElementById('status').className = 'badge bg-success';
            
            // Situação cadastral
            const situacao = data.descricao_situacao_cadastral || 'N/A';
            document.getElementById('situacao').textContent = situacao;
            document.getElementById('situacao').className = situacao === 'ATIVA' ? 'badge bg-success' : 'badge bg-warning';
            
            // Data da situação
            const dataSituacao = data.data_situacao_cadastral || '';
            if (dataSituacao) {
                const dataFormatada = new Date(dataSituacao).toLocaleDateString('pt-BR');
                document.getElementById('data-situacao').textContent = dataFormatada;
                document.getElementById('data-situacao').className = 'badge bg-light text-dark';
            }

            // Última atualização (usando data de início da atividade)
            const dataInicio = data.data_inicio_atividade || '';
            if (dataInicio) {
                const dataFormatada = new Date(dataInicio).toLocaleDateString('pt-BR');
                document.getElementById('ultima-atualizacao').textContent = `Início: ${dataFormatada}`;
                document.getElementById('ultima-atualizacao').className = 'badge bg-light text-dark';
            }

            // Dados básicos
            document.getElementById('cnpj-campo').value = formatarCNPJ(data.cnpj);
            document.getElementById('razao-social').value = data.razao_social || '';
            document.getElementById('nome-fantasia').value = data.nome_fantasia || '';
            document.getElementById('natureza-juridica').value = data.natureza_juridica || '';
            document.getElementById('porte').value = data.porte || '';
            document.getElementById('email').value = data.email || '';

            // Telefone
            const telefone = data.ddd_telefone_1 || '';
            if (telefone) {
                document.getElementById('telefone').value = formatarTelefone(telefone);
            }

            // Endereço
            const logradouro = data.descricao_tipo_de_logradouro ? 
                `${data.descricao_tipo_de_logradouro} ${data.logradouro}` : 
                data.logradouro || '';
            document.getElementById('logradouro').value = logradouro;
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('numero').value = data.numero || '';
            document.getElementById('complemento').value = data.complemento || '';
            document.getElementById('municipio').value = data.municipio || '';
            document.getElementById('uf').value = data.uf || '';
            document.getElementById('cep').value = formatarCEP(data.cep);

            // Atividade principal
            const atividadePrincipalEl = document.getElementById('atividade-principal');
            if (data.cnae_fiscal && data.cnae_fiscal_descricao) {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`;
                atividadePrincipalEl.appendChild(li);
            }

            // Atividades secundárias
            const atividadesSecundariasEl = document.getElementById('atividades-secundarias');
            if (data.cnaes_secundarios && data.cnaes_secundarios.length > 0) {
                data.cnaes_secundarios.forEach(atividade => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = `${atividade.codigo} - ${atividade.descricao}`;
                    atividadesSecundariasEl.appendChild(li);
                });
            }

            // Quadro societário
            const membrosEl = document.getElementById('membros');
            if (data.qsa && data.qsa.length > 0) {
                data.qsa.forEach(socio => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-start';
                    
                    const div = document.createElement('div');
                    div.className = 'ms-2 me-auto';
                    
                    const nome = document.createElement('div');
                    nome.className = 'fw-bold';
                    nome.textContent = socio.nome_socio || '';
                    
                    const cargo = document.createElement('small');
                    cargo.className = 'text-muted';
                    cargo.textContent = socio.qualificacao_socio || '';
                    
                    div.appendChild(nome);
                    div.appendChild(cargo);
                    
                    if (socio.faixa_etaria) {
                        const idade = document.createElement('span');
                        idade.className = 'badge bg-secondary rounded-pill';
                        idade.textContent = socio.faixa_etaria;
                        li.appendChild(div);
                        li.appendChild(idade);
                    } else {
                        li.appendChild(div);
                    }
                    
                    membrosEl.appendChild(li);
                });
            }

            // Retorno JSON
            document.getElementById('retorno-cru').textContent = JSON.stringify(data, null, 2);
            
            // Preenche informações adicionais
            preencherInformacoesAdicionais(data);
        }

        function salvarHistorico(data) {
            let historico = JSON.parse(localStorage.getItem('historico_cnpjs')) || [];
            const novaEntrada = {
                cnpj: formatarCNPJ(data.cnpj),
                rsocial: data.razao_social || '',
                data: new Date().toLocaleDateString('pt-BR')
            };
            
            // Remove duplicatas
            historico = historico.filter(item => item.cnpj !== novaEntrada.cnpj);
            
            // Adiciona no início
            historico.unshift(novaEntrada);
            
            // Mantém apenas os últimos 50 registros
            if (historico.length > 50) {
                historico = historico.slice(0, 50);
            }
            
            localStorage.setItem('historico_cnpjs', JSON.stringify(historico));
        }

        function formatarCNPJ(cnpj) {
            if (!cnpj) return '';
            return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }

        function formatarCEP(cep) {
            if (!cep) return '';
            return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }

        function formatarTelefone(telefone) {
            if (!telefone) return '';
            if (telefone.length === 11) {
                return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (telefone.length === 10) {
                return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
            }
            return telefone;
        }

        function limparInformacoesAdicionais() {
            const camposAdicionais = [
                'info-capital-social', 'info-matriz-filial', 'info-data-abertura', 'info-codigo-ibge',
                'info-codigo-municipio', 'info-tipo-logradouro', 'info-telefone2', 'info-fax',
                'info-motivo-situacao', 'info-situacao-especial', 'info-data-situacao-especial',
                'info-responsavel', 'info-simples', 'info-mei'
            ];
            
            camposAdicionais.forEach(campo => {
                const elemento = document.getElementById(campo);
                if (elemento) {
                    elemento.textContent = '-';
                }
            });
            
            document.getElementById('info-regime-tributario').innerHTML = '<small class="text-muted">Nenhuma informação disponível</small>';
        }

        function preencherInformacoesAdicionais(data) {
            // Dados Empresariais
            document.getElementById('info-capital-social').textContent = 
                data.capital_social ? `R$ ${Number(data.capital_social).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'Não informado';
            
            document.getElementById('info-matriz-filial').textContent = 
                data.descricao_identificador_matriz_filial || 'Não informado';
            
            if (data.data_inicio_atividade) {
                const dataFormatada = new Date(data.data_inicio_atividade).toLocaleDateString('pt-BR');
                document.getElementById('info-data-abertura').textContent = dataFormatada;
            }
            
            document.getElementById('info-codigo-ibge').textContent = 
                data.codigo_municipio_ibge || 'Não informado';

            // Informações de Localização
            document.getElementById('info-codigo-municipio').textContent = 
                data.codigo_municipio || 'Não informado';
            
            document.getElementById('info-tipo-logradouro').textContent = 
                data.descricao_tipo_de_logradouro || 'Não informado';
            
            const telefone2 = data.ddd_telefone_2 || '';
            document.getElementById('info-telefone2').textContent = 
                telefone2 ? formatarTelefone(telefone2) : 'Não informado';
            
            const fax = data.ddd_fax || '';
            document.getElementById('info-fax').textContent = 
                fax ? formatarTelefone(fax) : 'Não informado';

            // Situação Fiscal
            document.getElementById('info-motivo-situacao').textContent = 
                data.descricao_motivo_situacao_cadastral || 'Não informado';
            
            document.getElementById('info-situacao-especial').textContent = 
                data.situacao_especial || 'Nenhuma';
            
            if (data.data_situacao_especial) {
                const dataFormatada = new Date(data.data_situacao_especial).toLocaleDateString('pt-BR');
                document.getElementById('info-data-situacao-especial').textContent = dataFormatada;
            } else {
                document.getElementById('info-data-situacao-especial').textContent = 'Não informado';
            }
            
            document.getElementById('info-responsavel').textContent = 
                data.ente_federativo_responsavel || 'Não informado';

            // Regime Tributário
            const regimeTributarioEl = document.getElementById('info-regime-tributario');
            if (data.regime_tributario && data.regime_tributario.length > 0) {
                regimeTributarioEl.innerHTML = '';
                data.regime_tributario.forEach(regime => {
                    const div = document.createElement('div');
                    div.className = 'mb-2 p-2 border rounded bg-white';
                    div.innerHTML = `
                        <strong>Ano ${regime.ano}:</strong> ${regime.forma_de_tributacao}<br>
                        <small class="text-muted">Escriturações: ${regime.quantidade_de_escrituracoes}</small>
                    `;
                    regimeTributarioEl.appendChild(div);
                });
            }

            // Opções Fiscais
            const simplesStatus = data.opcao_pelo_simples === null ? 'Não optante' : 
                                 data.opcao_pelo_simples ? 'Optante' : 'Não optante';
            document.getElementById('info-simples').innerHTML = 
                `<span class="badge ${data.opcao_pelo_simples ? 'bg-success' : 'bg-secondary'}">${simplesStatus}</span>`;
            
            const meiStatus = data.opcao_pelo_mei === null ? 'Não optante' : 
                             data.opcao_pelo_mei ? 'Optante' : 'Não optante';
            document.getElementById('info-mei').innerHTML = 
                `<span class="badge ${data.opcao_pelo_mei ? 'bg-success' : 'bg-secondary'}">${meiStatus}</span>`;
        }

        // Adiciona o evento keypress ao campo de CNPJ
        document.getElementById("cnpj").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("consultar").click();
            }
        });

        // Aplicar máscara no campo CNPJ
        $(document).ready(function() {
            $('#cnpj').mask('00.000.000/0000-00');
            
            // Verifica se há CNPJ na URL para consulta automática
            const urlParams = new URLSearchParams(window.location.search);
            const cnpjParam = urlParams.get('cnpj');
            if (cnpjParam) {
                const cnpjFormatado = formatarCNPJ(cnpjParam);
                document.getElementById('cnpj').value = cnpjFormatado;
                // Executa a consulta automaticamente
                setTimeout(() => {
                    callcnpj(cnpjFormatado);
                }, 500);
            }
        });
