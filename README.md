---
title: 'Projeto API filmes'
disqus: hackmd
---

Projetos API Filmes
===


## Table of Contents

[TOC]

## Beginners Guide


#### Project initialization

1. Download or fork the project!
2. Install Node v18.15.0. 
3. Npm install , npm i command to download project dependencies.
4. Install database PostgreSQL , Port: 5432 , Version: 16.1
5. Create database with "dpproject" name.
6. create a .env file as shown below
6. NPM start para iniciar na porta 5000

#### Inicialização do projeto
1. Baixe ou faça um fork do projeto!
2. Instale o Node v18.15.0
3. Instalação npm , comando npm i para baixar dependências do projeto.
4. Instale o banco de dados PostgreSQL, Porta: 5432, Versão: 16.1
5. Crie um banco de dados denominado dpproject.
6. Crie um arquivo .env conforme mostrado abaixo.
6. O NPM inicia a inicialização na porta 5000

## Arquivo .env


```gherkin=
# DATABASE
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=dpproject
DB_PORT=5432

# FIRST ADMIN USER 
FIRST_NAME=admin
FIRST_EMAIL=admin@admin.com
FIRST_PASSWORD=123456

#create user token
SECRET=asder145@45%67

#API
YOUR_API_KEY= "Criar Conta no OMDB"
```

### Post Man 
Esta no Projeto o postman com as rotas , filmesAPI.postman_collection.json



### Criação de primeiro usuário ADMIN pelo sistema.
#### Regra

```gherkin=
Recurso: Criação do primeiro usuário administrador
     Regra: Cadastro de administrador do sistema, só pode ser feito por admin.
     Portanto o sistema tem que criar um usuário padrão pela primeira vez no banco antes de ter outros usuários administradores.
  
     Cenário: Sistema cria usuário padrão
       permitindo a criação de mais usuários
```

#### Mensagem no console depois de criado o banco e primeiro usuário admin
```gherkin=
[nodemon] restarting due to changes...
[nodemon] starting `node ./index.js localhost 5000`
Executing (default): SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Users'Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'Users' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): SELECT "id", "name", "email", "password", "isAdmin", "createdAt", "updatedAt" FROM "Users" AS "User" WHERE "User"."isAdmin" = true LIMIT 1;
O administrador já existe
O servidor está rodando na porta 5000
```

#### Falhas 
```gherkin=
 - Caso senha errada no login 
 Mensagem : {
    "message": "Senha inválida!"
}
 - Caso Email errado no login 
{
    "message": "Não há usuário cadastrado com este e-mail!"
}

```

#### Login com sucesso .
```gherkin=
- Roda : http://localhost:5000/users/login
Body Json : {
    "email": "admin@admin.com",
    "password": "123456"

}
return :
{
    "message": "Você está autenticado",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzAyOTM2MzkxfQ.5TS1jrpPlQtwReqF40io2kmrIlEmanmTIHJJk9ZDUZY",
    "userId": 1,
    "isAdmin": true
}

```


### Criação do Segundo usuário Administrador

```gherkin=
Feature: Criação User Admin
  # Usuário Administrador 
  Regras : Um usuário administrador só pode ser criado por outro ADMIN.

  Cenário: Não passa o nome 
  Envia um mensagem de falha
   - Não é passado o email 
   Envia mensagem de falha 
   - Email igual de outra usuário !
   Envia mensagem para mudar 
   - Senha em vazio 
   Mensagem de Erro 
   - Senha diferentes 
   Mensagem de Erro 

   Quando tiver passado Nome , Email e senha corretos e validados 
   Criar novo Admin 
   Passar token e userId .
   isAdmin : true para front end 
```

#### cadastro

```gherkin=
  Rota :  http://localhost:5000/users/registerAdmin

  Body Json :
  {
    "name": "Carlos",
    "email": "Carlos@gmail.com",
    "password": "101010",
    "confirmPassword": "101010"

  }
  Return :
  {
    "message": "Você está autenticado",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2FybG9zIiwiaWQiOjIsImlhdCI6MTcwMjkzNjY0N30.svDoeDdkZg-axRTLFTnZW19hRm5wgq6IxxFeUjny2HQ",
    "userId": 2,
    "isAdmin": true
}
```
### Deletar do banco de dados user 

```gherkin=
Feature: Deletar User Admin
  # Usuário Administrador 
  Regras : Um usuário só pode ser deletado por outro administrador.

  Cenário: Não passa o nome 
  Envia um mensagem de falha
   - Não é passado o email 
   Envia mensagem de falha 
   - Email igual de outra usuário !
   Envia mensagem para mudar 
   - Senha em vazio 
   Mensagem de Erro 
   - Senha diferentes 
   Mensagem de Erro 
```
#### Resposta caso tiver errado . 

```gherkin=
Roda :  users/removeUsers
{
    "name": "admi",
    "email": "admin@admin.com"
} 
Retorna : 422
{
    "message": "Por favor, verifique o nome a ser removido!"
}

Email erro o retorno : 
{
    "message": "Por favor, utilize outro e-mail!"
}

Caso em passado dados corretos o retorno : 
{
    "message": "Usuário removido com sucesso!"
}
e o Usuário e excluído do banco de dados.
```
#### Logs

Por segurança depois a exclusão as informações de qual admin exclui e email e nome do user excluído vão tabela de logs.

![Alt text](public/Readme_files/image.png)


### Criação de User padrão

```gherkin=
Feature: Criação User Padrão
  # Usuário 
  Regras : Um usuário padrão não tem acesso a todas as rotas.

  Cenário: Não passa o nome 
  Envia um mensagem de falha
   - Não é passado o email 
   Envia mensagem de falha 
   - Email igual de outra usuário !
   Envia mensagem para mudar 
   - Senha em vazio 
   Mensagem de Erro 
   - Senha diferentes 
   Mensagem de Erro 

   Quando tiver passado Nome , Email e senha corretos e validados 
   Criar novo Admin 
   Passar token e userId .
   isAdmin : true para front end 
```
#### Criação
```gherkin=
Mesmo padrão de verificação do Admin

Passado : 
{
    "name": "fernando ",
    "email": "fernando@gmail.com",
    "password": "123456",
    "confirmPassword": "123456"

}
Retorna :
{
    "message": "Você está autenticado",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmVybmFuZG8gIiwiaWQiOjMsImlhdCI6MTcwMjkzODU2Mn0.DthWea5OBg50P7uSvHBSXFovYoNymEbH69jGSsAqDbQ",
    "userId": 3,
    "isAdmin": false
}
```

Print do Banco de dados mostrando que a senha está criptografadas e temos o isAdmin para diferenciar de um user admin .
![Alt text](public/Readme_files/user_banco.png)


### Quando user padrão se desativa

```gherkin=
O user padrão só pode se desativar , nunca desativar outro user padrão sem ser admin.

Então o id pego pelo token .

Rota : users/deactivation
Onde é passado o Token
retorna :
{
    "message": "Usuário atualizado com sucesso!"
}
```

No Banco user o bit muda de status !

![Alt text](public/Readme_files/user_bit.png)


### Rota de Atualização de cadastro
```gherkin=
Rota : users/edit
 - Mesma rota para todos user , id pego pelo TOKEN
{
    "name": "fabio",
    "email": "fabiob@gmail.com",
    "password" : "123456",
    "confirmPassword": "123456"

}
Retorna :
{
    "message": "Usuário atualizado com sucesso!"
}

```

Antes : 
![Alt text](public/Readme_files/patch_antes.png)

Depois: 
![Alt text](public/Readme_files/patch_depois.png)


### Rota para busca filme para cadastro 

![Alt text](public/Readme_files/post_man_movie_busca.png)

Depois e pelo o imdbId e repassado na rota movie/moviesById , para ver detalhes do filme


```gherkin=
Rota : movie/moviesById
Passa :  idMovie 
retorna: 
{
    "movies": {
        "Title": "To End All War: Oppenheimer & the Atomic Bomb",
        "Year": "2023",
        "Rated": "N/A",
        "Released": "10 Jul 2023",
        "Runtime": "87 min",
        "Genre": "Documentary",
        "Director": "Christopher Cassel",
        "Writer": "N/A",
        "Actors": "J. Robert Oppenheimer, Kai Bird, Ellen Bradbury",
        "Plot": "Exploring how one man's brilliance, hubris and relentless drive changed the nature of war forever.",
        "Language": "English",
        "Country": "United States",
        "Awards": "N/A",
        "Poster": "https://m.media-amazon.com/images/M/MV5BOTI1ZjI3MDctMzFmOC00NTZkLWI3ZjUtODMzNmI4MzM1NmRkXkEyXkFqcGdeQXVyNjQzMDEyOTI@._V1_SX300.jpg",
        "Ratings": [
            {
                "Source": "Internet Movie Database",
                "Value": "7.4/10"
            }
        ],
        "Metascore": "N/A",
        "imdbRating": "7.4",
        "imdbVotes": "1,999",
        "imdbID": "tt28240284",
        "Type": "movie",
        "DVD": "N/A",
        "BoxOffice": "N/A",
        "Production": "N/A",
        "Website": "N/A",
        "Response": "True"
    }
}
```

#### Rota de criação de filmes cadastrado no banco 

```gherkin=
Rota : movie/create
Passa :  idMovie por Query
retorna: 
{
    "createMovies": {
        "id": 1,
        "Title": "To End All War: Oppenheimer & the Atomic Bomb",
        "IdMovie": "tt28240284",
        "Runtime": "87 min",
        "Genre": "Documentary",
        "Director": "Christopher Cassel",
        "Actors": "J. Robert Oppenheimer, Kai Bird, Ellen Bradbury",
        "Poster": "https://m.media-amazon.com/images/M/MV5BOTI1ZjI3MDctMzFmOC00NTZkLWI3ZjUtODMzNmI4MzM1NmRkXkEyXkFqcGdeQXVyNjQzMDEyOTI@._V1_SX300.jpg",
        "Plot": "Exploring how one man's brilliance, hubris and relentless drive changed the nature of war forever.",
        "IdUser": "4",
        "bit": true,
        "updatedAt": "2023-12-18T23:15:11.911Z",
        "createdAt": "2023-12-18T23:15:11.911Z"
    }
}
```
### Rota de votos 

```gherkin=
Rota :movie/createVote
Passa :  
{
    "note": 4 ,
    "IdMovie": 1
}
retorna: 
{
    "message": "Seu voto foi computado, Parabéns !"
}


CASO o user tentar fazer mais de uma voto :

{
    "message": "Só pode votar uma vez por Filme!"
}

CASO não tiver o id do filme :

{
    "message": "Filme não encontrado ! "
}

```

#### Rota para trazer todos os filmes 

```gherkin=
Rota :movie/movieAll
Passa :  
{
    "movieWithAverage": [
        {
            "id": 1,
            "Title": "To End All War: Oppenheimer & the Atomic Bomb",
            "IdMovie": "tt28240284",
            "Runtime": "87 min",
            "Genre": "Documentary",
            "Director": "Christopher Cassel",
            "Actors": "J. Robert Oppenheimer, Kai Bird, Ellen Bradbury",
            "Poster": "https://m.media-amazon.com/images/M/MV5BOTI1ZjI3MDctMzFmOC00NTZkLWI3ZjUtODMzNmI4MzM1NmRkXkEyXkFqcGdeQXVyNjQzMDEyOTI@._V1_SX300.jpg",
            "Plot": "Exploring how one man's brilliance, hubris and relentless drive changed the nature of war forever.",
            "AverageNote": {
                "AverageNote": 4,
                "votes": 1
            }
        },
        {
            "id": 2,
            "Title": "The Panic in Needle Park",
            "IdMovie": "tt0067549",
            "Runtime": "110 min",
            "Genre": "Drama",
            "Director": "Jerry Schatzberg",
            "Actors": "Al Pacino, Kitty Winn, Alan Vint",
            "Poster": "https://m.media-amazon.com/images/M/MV5BNmQ0YTg2ZGQtMmQ1My00ZThjLWEyM2UtNjlhNDE3MDdhNjhlXkEyXkFqcGdeQXVyMTUzMDUzNTI3._V1_SX300.jpg",
            "Plot": "Follows the lives of heroin addicts who frequent \"Needle Park\" in New York City.",
            "AverageNote": {
                "AverageNote": 4,
                "votes": 1
            }
        },
        {
            "id": 3,
            "Title": "Panic",
            "IdMovie": "tt10344410",
            "Runtime": "N/A",
            "Genre": "Adventure, Crime, Drama",
            "Director": "N/A",
            "Actors": "Olivia Scott Welch, Mike Faist, Jessica Sula",
            "Poster": "https://m.media-amazon.com/images/M/MV5BODlhZjI4OTgtNzJmNS00NzBiLWE5ZWYtOTkxMGI1OTA5MzA4XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
            "Plot": "No one knows who invented Panic or when it first began. But in the forgotten rural town of Carp, Texas, the game is the only way out. Every summer the graduating seniors risk their lives competing in a series of challenges that fo...",
            "AverageNote": {
                "AverageNote": 4,
                "votes": 1
            }
        }
    ]
}

```

### Rota para trazer um só filme 


```gherkin=
Rota : movie/getByIdMovie
Passa :   por query o id
{
    "byMovie": {
        "Title": "Panic",
        "id": 3,
        "IdMovie": "tt10344410",
        "Runtime": "N/A",
        "Genre": "Adventure, Crime, Drama",
        "Director": "N/A",
        "Actors": "Olivia Scott Welch, Mike Faist, Jessica Sula",
        "Poster": "https://m.media-amazon.com/images/M/MV5BODlhZjI4OTgtNzJmNS00NzBiLWE5ZWYtOTkxMGI1OTA5MzA4XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
        "Plot": "No one knows who invented Panic or when it first began. But in the forgotten rural town of Carp, Texas, the game is the only way out. Every summer the graduating seniors risk their lives competing in a series of challenges that fo...",
        "AverageNote": 4,
        "VotesAmount": 1
    }
}

```

### 


User flows
---
```sequence
Postman->Sistema: Requisição POST em json
Note right of Sistema: Sistema thinks
Sistema-->Postman: Retorna !
Note left of Postman: Postman responds
```

Project Timeline
---
```mermaid
gantt
    title Projeto Filme teste

    section Section
    start project          :a1, 2023-12-06, 1h
    Criação de pastas     :after a1  , 3h
    criação database    :a2, 2023-12-07  , 4h
    Criação arquivo env. :after a2  , 2h
    Criação primeiro Usuário : a3, 2023-12-08 , 3h
    Colocado Eslint no projeto :  after a3, 1h
    Colocado prettier : after a3, 1h
    Criação rota de cadastro de usuário : after a3, 2h
    Criação de token : after a3 , 2h
    Criação do verificar token : a4 ,2023-12-10 , 1h
    Criação do roda get id e documentos : after a4 , 2h
    Criação da Edição admin : a5, 2023-12-11 , 2h
    Acertando documentação : after a5 , 1h
```

> Read more about mermaid here: http://mermaid-js.github.io/mermaid/

## Appendix and FAQ

:::info
**Find this document incomplete?** Leave a comment!
:::

###### tags: `Templates` `Documentation`

