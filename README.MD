#APP

Gympass styles app.

## Rfs
 - [x] Deve ser possivel se cadastrar
 - [x] Deve ser possivel se autenticar
 - [x] Deve ser possivel obter o perfil de um usuario logado
 - [] Deve ser possivel obter o numero de check-ins realizados 
 - [x] Deve ser possivel o usuario obter seu historico de check-ins
 - [] Deve ser possivel o usuario buscar academias proximas
 - [] Deve ser possivel o usuario buscar academias pelo nome
 - [x] Deve ser possivel o usuario realizar check-in de uma academia
 - [] Deve ser possivel validar o check-in de um usuario
 - [x] Deve ser possivel cadastrar uma academia

## RNs
 - [x] O usuario nao deve poder se cadastrar com um email duplicado
 - [x] O usuario nao pode fazer dois check-in ao mesmo dia 
 - [x] O usuario nao pode fazer check-in se nao estiver perto da academia
 - [] O check-in so pode ser validado 20min apos criado
 - [] O check-in so pode ser validado por adm
 - [] A academia so pode ser cadastrada por adm

## RNFs
 - [x] A senha do usuario precisa estar criptografada
 - [x] Os dados da aplicacao precisa estar persistidos em um banco PostgreSQL
 - [x] Todas listas de dados precisam estar paginadas com 20 itens por paginas
 - [] O usuario deve ser identificado por um JWT JSON WEB TOKEN