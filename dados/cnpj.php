<?php
header('Access-Control-Allow-Origin: troque_para_seu_dominio.com.br'); 
//Garantir que seja lido sem problemas
header("Content-Type: text/plain");

//Capturar CNPJ
$cnpj = $_REQUEST["cnpj"];
$cnpj = preg_replace("/[^0-9]/", "", $cnpj);

///Criando Comunicação cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.receitaws.com.br/v1/cnpj/".$cnpj);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$retorno = curl_exec($ch);
curl_close($ch);

$retorno = json_decode($retorno); //Ajuda a ser lido mais rapidamente

//criamos o arquivo
$arquivo = fopen( $cnpj + ".txt", "w");
if ($arquivo == false) die('Não foi possível criar o arquivo.');

$jscoderetorno = json_encode($retorno, JSON_PRETTY_PRINT);

fwrite($arquivo, $jscoderetorno);
fclose($arquivo);

echo $jscoderetorno;
//https://www.receitaws.com.br/v1/cnpj/
//https://publica.cnpj.ws/cnpj/
?>
