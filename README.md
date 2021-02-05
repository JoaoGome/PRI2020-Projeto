<!-- LOGO Escola Engenharia -->
<br />
<p align="center">
  <a href="https://github.com/miguel5/i3blocks-stoic-quote">
    <img src="https://facs2017.di.uminho.pt/sites/default/files/logo_UMEENG_sem_nome.jpg" alt="Logo">
  </a>

  <h3 align="center">PRI2020-Projeto</h3>

  <p align="center">
    Projeto de Processamento de Linguagens e Conhecimento 2020/2021
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#arquitetura-da-aplicação-baseada-em-microserviços">Arquitetura da Aplicação baseada em microserviços</a>
    </li>
    <li>
      <a href="#base-de-dados">Base de dados</a>
    </li>
    <li><a href="#flow-da-app">Flow da app</a></li>
    <li><a href="#páginas">Páginas</a></li>
    <li><a href="#lista-de-coisas-done">Lista de coisas done</a></li>
    <li><a href="#bd-recursos">BD recursos</a></li>
    <li><a href="#rotas">Rotas</a></li>
  </ol>
</details>


## Arquitetura da Aplicação baseada em microserviços
<ol>
    <li>Auth-server: servidor de autenticação, responsável por log in, log out e criar os tokens para cada user; port 8000</li>
    <li>Api-server: servidor de dados, reponsável por interajir com as bases de dados e verificar/devolver informação; port 8001</li>
    <li>App-server: responsável por tudo o que o utilizador ver. Utilizador interaje com estas interfaces e depois é reencaminhado para os outros servidores consoante o pedido; port 8002</li>
</ol>

## Base de dados
<ol>
    <li>Base de dados dos recursos. 
			 Com informações: id, titulo, dataCriação, dataRegisto na plataforma, 
			 visibilidade (publico -> todos podem ver e descarregar; privado: apenas disponivel para o produtor e os admins;),
			 autor, tipo (relatorio, tese, artigo, aplicação, slides, testes ...)
			 hastahgs para associar a um tema (ex: PL, Machine learning, Sistemas distribuidos bla bla bla)</li>
    <li>Base de dados dos comentários sobre recursos. 
			 Com informações: id do recurso, id do user que fez o comentário, texto do comentario.</li>
    <li>Base de dados dos users. 
			 Com informações: nome, email, filiação, level (consummer | producer | admin), data Registo na plataforma, data ultima acesso à plataforma, password.</li>
</ol>

## Flow da app
<ol>
    <li>User faz log in com o auth server, criamos um token</li>
    <li>Sempre que se faz um pedido, esse token é enviado usando query string (exemplo: GET //link/wtv/pedido?token=blablabla), verifica-se a conta associada ao token, se tiver permissão para o pedido good se nao erro</li>
    <li>Quando for para fazer upload de um ficheiro zip, recebemos o zip, usar a library node-stream-zip para verificar os conteudos do zip a ver se tudo correto, se sim guarda-se, se não erro</li>
</ol>

## Páginas
<ol>
    <li>Pagina principal com formulario de login/criar conta</li>
    <li>
        Depois de log in, ter varios links:
        <ol>
            <li>Um link que leve para uma pagina onde tem todos os recursos disponiveis para ver e sacar</li>
            <li>Um link que leve para uma pagina onde tem todos os recursos do user para ele poder editar; (se a conta for producer)</li>
            <li>Um link para log out</li>
            <li>Um link para fazer upload de mais ficheiros; (se a conta for producer)</li>
        </ol>
    </li>
    <li>
        Na pagina de um recursos, ter varias opções:
        <ol>
            <li>Pre-visualizar o recurso se o browser suportar</li>
            <li>Descarregar o recursos</li>
            <li>Ver os comentarios nesse recurso</li>
            <li>Poder escrever um comentário</li>
        </ol>
    </li>
</ol>

## Lista de coisas done
<ul>
    <li>log in done</li>
    <li>create account done</li>
    <li>api server recebe direito o token para validar o user</li>
</ul>

## BD recursos
<ol>
    <li>admin</li>
    <li>consumidor</li>
    <li>produtor</li>
</ol>

## Rotas
<ul>
    <li>http://localhost:8000/recursos/tipos -> lista de tipos</li>
    <li>http://localhost:8000/recursos -> recursos</li>
    <li>http://localhost:8000/recursos?vis=2 -> recursos</li>
    -- a partir daqui colocar sempre ?vis=1, vis=2 ou vis=3
    <li>http://localhost:8000/recursos?vis=1&hashtag=0 -> recursos com determinado hashtag</li>
    <li>http://localhost:8000/recursos?vis=1&tipo=tese -> recursos com determinado tipo</li>
    <li>http://localhost:8000/recurso/06?vis=1 -> determinado recurso</li>
</ul>