# Consulta CNPJ - Projeto com BrasilAPI

Este é um projeto de consulta online de **CNPJ** utilizando a API gratuita da [BrasilAPI](https://brasilapi.com.br/docs#tag/CNPJ), exibindo os dados em uma interface moderna construída com **Bootstrap 5**

Disponível em: [https://ggortan.github.io/consulta-cnpj/](https://ggortan.github.io/consulta-cnpj/)


> **Nota sobre a versão 3:**  
> Esta versão marca a **migração da API ReceitaWS** (usada nas versões anteriores) para a **BrasilAPI**, uma API pública e gratuita mantida por voluntários, com mais estabilidade e melhor documentação.

---

## API Utilizada

- **BrasilAPI - CNPJ**  
  Endpoint: `GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}`  
  Documentação: [https://brasilapi.com.br/docs#tag/CNPJ](https://brasilapi.com.br/docs#tag/CNPJ)

---

## Tecnologias

- HTML5
- JavaScript
- Bootstrap 5 (via CDN da Cloudflare)
- LocalStorage (para armazenar histórico de consultas)

---

## Funcionalidades

- Consulta de CNPJ com dados detalhados
- Histórico local das últimas consultas realizadas
- Exportação de histórico em CSV
- Interface responsiva e amigável
- Acesso direto ao resultado formatado (ex: `/index.html?cnpj=12345678000195`)

---

Gabriel Gortan  
🔗 [https://www.linkedin.com/in/gabrielgortan/](https://www.linkedin.com/in/gabrielgortan/)

