document.addEventListener('DOMContentLoaded', function() {
            const historicoTabela = document.getElementById('historico-tabela');
            const clearHistoryBtn = document.getElementById('clear-history');
            const exportHistoryBtn = document.getElementById('export-history');
            const emptyState = document.getElementById('empty-state');
            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

            // Função para formatar CNPJ
            function formatarCNPJ(cnpj) {
                if (!cnpj) return '';
                const cnpjLimpo = cnpj.replace(/[^0-9]/g, '');
                if (cnpjLimpo.length === 14) {
                    return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
                }
                return cnpj;
            }

            // Função para carregar o histórico
            function carregarHistorico() {
                const historico = JSON.parse(localStorage.getItem('historico_cnpjs')) || [];
                historicoTabela.innerHTML = '';
                
                if (historico.length === 0) {
                    emptyState.classList.remove('d-none');
                    document.querySelector('.table-responsive').classList.add('d-none');
                    return;
                }

                emptyState.classList.add('d-none');
                document.querySelector('.table-responsive').classList.remove('d-none');

                historico.forEach((entry, index) => {
                    const tr = document.createElement('tr');
                    
                    const tdCnpj = document.createElement('td');
                    const cnpjFormatado = formatarCNPJ(entry.cnpj);
                    tdCnpj.innerHTML = `<code class="text-primary">${cnpjFormatado}</code>`;

                    const tdRSocial = document.createElement('td');
                    tdRSocial.textContent = entry.rsocial || 'N/A';
                    tdRSocial.className = 'text-truncate';
                    tdRSocial.style.maxWidth = '300px';
                    tdRSocial.title = entry.rsocial;

                    const tdData = document.createElement('td');
                    tdData.innerHTML = `<small class="text-muted">${entry.data}</small>`;

                    const tdAcoes = document.createElement('td');
                    tdAcoes.className = 'text-center';
                    
                    const btnConsultar = document.createElement('button');
                    btnConsultar.className = 'btn btn-sm btn-outline-primary me-1';
                    btnConsultar.innerHTML = '<i class="bi bi-search"></i>';
                    btnConsultar.title = 'Consultar novamente';
                    btnConsultar.onclick = () => {
                        const cnpjLimpo = entry.cnpj.replace(/[^0-9]/g, '');
                        window.location.href = `index.html?cnpj=${cnpjLimpo}`;
                    };
                    
                    const btnRemover = document.createElement('button');
                    btnRemover.className = 'btn btn-sm btn-outline-danger';
                    btnRemover.innerHTML = '<i class="bi bi-trash"></i>';
                    btnRemover.title = 'Remover do histórico';
                    btnRemover.onclick = () => removerItem(index);
                    
                    tdAcoes.appendChild(btnConsultar);
                    tdAcoes.appendChild(btnRemover);

                    tr.appendChild(tdCnpj);
                    tr.appendChild(tdRSocial);
                    tr.appendChild(tdData);
                    tr.appendChild(tdAcoes);
                    historicoTabela.appendChild(tr);
                });
            }

            // Função para remover item específico
            function removerItem(index) {
                let historico = JSON.parse(localStorage.getItem('historico_cnpjs')) || [];
                historico.splice(index, 1);
                localStorage.setItem('historico_cnpjs', JSON.stringify(historico));
                carregarHistorico();
                
                // Toast de confirmação
                mostrarToast('Item removido do histórico', 'success');
            }

            // Função para limpar o histórico
            function limparHistorico() {
                localStorage.removeItem('historico_cnpjs');
                carregarHistorico();
                confirmModal.hide();
                mostrarToast('Histórico limpo com sucesso', 'success');
            }

            // Função para exportar histórico
            function exportarHistorico() {
                const historico = JSON.parse(localStorage.getItem('historico_cnpjs')) || [];
                
                if (historico.length === 0) {
                    mostrarToast('Nenhum dado para exportar', 'warning');
                    return;
                }

                let csv = 'CNPJ,Razão Social,Data da Consulta\n';
                historico.forEach(entry => {
                    const cnpj = `"${entry.cnpj}"`;
                    const rsocial = `"${entry.rsocial || ''}"`;
                    const data = `"${entry.data}"`;
                    csv += `${cnpj},${rsocial},${data}\n`;
                });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `historico_cnpj_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                mostrarToast('Histórico exportado com sucesso', 'success');
            }

            // Função para mostrar toast
            function mostrarToast(mensagem, tipo = 'info') {
                // Remove toasts existentes
                const toastsExistentes = document.querySelectorAll('.toast');
                toastsExistentes.forEach(t => t.remove());

                const toastHtml = `
                    <div class="toast align-items-center text-white bg-${tipo === 'success' ? 'success' : tipo === 'warning' ? 'warning' : 'primary'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                                ${mensagem}
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                `;

                // Container para toasts
                let toastContainer = document.getElementById('toast-container');
                if (!toastContainer) {
                    toastContainer = document.createElement('div');
                    toastContainer.id = 'toast-container';
                    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                    document.body.appendChild(toastContainer);
                }

                toastContainer.innerHTML = toastHtml;
                const toastElement = toastContainer.querySelector('.toast');
                const toast = new bootstrap.Toast(toastElement);
                toast.show();
            }

            // Event Listeners
            clearHistoryBtn.addEventListener('click', () => {
                const historico = JSON.parse(localStorage.getItem('historico_cnpjs')) || [];
                if (historico.length === 0) {
                    mostrarToast('O histórico já está vazio', 'warning');
                    return;
                }
                confirmModal.show();
            });

            document.getElementById('confirm-clear').addEventListener('click', limparHistorico);
            exportHistoryBtn.addEventListener('click', exportarHistorico);

            // Verifica se há CNPJ para consultar na URL
            const urlParams = new URLSearchParams(window.location.search);
            const cnpjParam = urlParams.get('cnpj');
            if (cnpjParam) {
                // Redireciona para index.html com o CNPJ
                window.location.href = `index.html?cnpj=${cnpjParam}`;
            }

            // Carrega o histórico
            carregarHistorico();
        });