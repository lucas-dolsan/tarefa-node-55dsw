### inserir compromisso 
	POST localhost:3000/api/compromissos
	BODY (JSON)
	{
        "nome": "nome do compromisso",
        "descricao": "descrição do compromisso",
        "local": "local do compromisso",
        "data": "01-01-2021",
        "contatoId": "111",
        "usuarioId": "111"
    }
### consultar todos os compromissos
    GET localhost:3000/api/compromissos

### consultar compromissos filtrando pelo contato
    GET localhost:3000/api/compromissos?contatoId=111

### consultar compromissos filtrando por um intervalo de data
    GET localhost:3000/api/compromissos?dataInicio=01-01-2010&dataFim=01-01-2025

### excluir um compromisso
    DELETE localhost:3000/api/compromissos/111

### inserir contato
    POST localhost:3000/api/contatos
    BODY (JSON)
    {
        "nome": "nome do contato",
        "fone": "fone do contato",
        "email": "email@do.contato"
    }   

### atualizar contato
    PUT localhost:3000/api/contatos
    BODY (JSON)
    {
	    "usuarioId": "60e9e171d4c6796d7d215418"
    }

### consultar contatos filtrando pelo nome
    GET localhost:3000/api/contatos?nome=nome do contato

### inserir um usuario
    POST localhost:3000/api/auth/register
    BODY (JSON)
    {
	    "nome": "nome do usuario",
		"username": "username do usuario",
        "senha": "senha do usuario"
    }

### realizar login
    POST localhost:3000/api/auth/login
    BODY (JSON)
    {
	    "username": "username do usuario",
	    "senha": "senha do usuario"
    }

















