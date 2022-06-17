var input = document.getElementById("cnpj");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
// If the user presses the "Enter" key on the keyboard
if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("consultar").click();
}
}); 

function callcnpj(cnpj){
$.ajax({
    'url' : 'https://receitaws.com.br/v1/cnpj/' + cnpj.replace(/[^0-9]/g, ''),
    'type': "GET",
    'dataType': 'jsonp',
    'success': function(data){
       if(data.nome == undefined){
           
        }else{

            document.getElementById('situacao').textContent = data.situacao;
            document.getElementById('data-situacao').textContent = data.data_situacao + " (" + ( new Date().getFullYear() - data.data_situacao.split('/')[2])  + " anos )";
            document.getElementById('data-situacao').className = "badge bg-light text-dark";

                if(data.situacao == "ATIVA"){
                    document.getElementById('situacao').className = "badge bg-success"
                    
                }else{
                    document.getElementById('situacao').className = "badge bg-warning"
                }

            document.getElementById('status').textContent = data.status;
                if(data.status == "OK"){
                    document.getElementById('status').className = "badge bg-success"
                }else{
                    document.getElementById('status').className = "badge bg-warning"
                }
            
            
            document.getElementById('cnpj-campo').value = data.cnpj;
            document.getElementById('ultima-atualizacao').textContent = "Ultima Atualização: " + data.ultima_atualizacao; 
            document.getElementById('ultima-atualizacao').classList.remove("placeholder","col-7");
            document.getElementById('ultima-atualizacao').className = "badge bg-light text-dark";

            document.getElementById('razao-social').value = data.nome;
            document.getElementById('nome-fantasia').value = data.fantasia;
            document.getElementById('telefone').value = data.telefone;
            document.getElementById('logradouro').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('numero').value = data.numero;
            document.getElementById('municipio').value = data.municipio;
            document.getElementById('cep').value = data.cep;
            document.getElementById('uf').value = data.uf;
            
            document.getElementById('retorno-cru').textContent = JSON.stringify(data, null, 1);

            
            localStorage.setItem('cnpj' , data.cnpj);
            console.log(data);

      }
    }
})
}