Arquitetura da Aplicação baseada em microserviços:

	1 -> Auth-server: servidor de autenticação, responsável por log in, log out e criar os tokens para cada user; port 8000
	2 -> Api-server: servidor de dados, reponsável por interajir com as bases de dados e verificar/devolver informação; port 8001
	3 -> App-server: responsável por tudo o que o utilizador ver. Utilizador interaje com estas interfaces e depois é reencaminhado para os outros servidores consoante o pedido; port 8002


Base de dados:

		1 -> Base de dados dos recursos. 
			 Com informações: id, titulo, dataCriação, dataRegisto na plataforma, 
			 visibilidade (publico -> todos podem ver e descarregar; privado: apenas disponivel para o produtor e os admins;),
			 autor, tipo (relatorio, tese, artigo, aplicação, slides, testes ...)
			 hastahgs para associar a um tema (ex: PL, Machine learning, Sistemas distribuidos bla bla bla)
		2 -> Base de dados dos comentários sobre recursos. 
			 Com informações: id do recurso, id do user que fez o comentário, texto do comentario.
		2 -> Base de dados dos users. 
			 Com informações: nome, email, filiação, level (consummer | producer | admin), data Registo na plataforma, data ultima acesso à plataforma, password.
			
Flow da app:

		1 -> User faz log in com o auth server, criamos um token;
		2 -> Sempre que se faz um pedido, esse token é enviado usando query string (exemplo: GET //link/wtv/pedido?token=blablabla), verifica-se a conta associada ao token, se tiver permissão para o pedido good se nao erro;
		3 -> Quando for para fazer upload de um ficheiro zip, recebemos o zip, usar a library node-stream-zip para verificar os conteudos do zip a ver se tudo correto, se sim guarda-se, se não erro

Paginas:

		1 -> Pagina principal com formulario de login/criar conta
		2 -> Depois de log in, ter varios links:

					2.1 -> Um link que leve para uma pagina onde tem todos os recursos disponiveis para ver e sacar;
					2.2 -> Um link que leve para uma pagina onde tem todos os recursos do user para ele poder editar; (se a conta for producer)
					2.3 -> Um link para log out;
					2.4 -> Um link para fazer upload de mais ficheiros; (se a conta for producer);
		
		3 -> Na pagina de um recursos, ter varias opções:

					3.1 -> Pre-visualizar o recurso se o browser suportar;
					3.2 -> Descarregar o recursos;
					3.3 -> Ver os comentarios nesse recurso;
					3.4 -> Poder escrever um comentário;


Lista de coisas done:

-> log in done
-> create account done
-> api server recebe direito o token para validar o user


------------------------------------------------------------

BD recursos:
1 - admin
2 - produtor
3 - consumidor

------------------------------------------------------------
rotas:

http://localhost:8000/recursos/tipos -> lista de tipos

http://localhost:8000/recursos -> recursos
http://localhost:8000/recursos?vis=2 -> recursos

-- a partir daqui colocar sempre ?vis=1, vis=2 ou vis=3
http://localhost:8000/recursos?vis=1&hashtag=0 -> recursos com determinado hashtag
http://localhost:8000/recursos?vis=1&tipo=tese -> recursos com determinado tipo

http://localhost:8000/recurso/06?vis=1 -> determinado recurso