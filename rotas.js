//----------------------------------- AUTH-server

GET /users/:id                                          // Consultar um user
GET /users/nivel/X                                      // Listar users de nivel X
DELETE /users/:uname                                    // Remover user
PUT /users/:uname?level=X                               // Altera o nível do user para X
POST /users/login                                       // Login de um user
POST /users/registar                                    // Cria um user


//----------------------------------- API-server

GET /comentarios/recurso/:rec                           // Consultar os comentários de um recurso
GET /comentarios/user/:user                             // Consultar user comentarios
POST /comentarios/recurso/:rec                          // Adicionar um comentário
DELETE /comentarios/:c                                  // Eliminar comentario--------
DELETE /comentarios/recurso/:rec                        // Remover comentarios do recurso--------
DELETE /comentarios/user/:user                          // Remover user comentarios
PUT /comentarios/user/:user                             // Passar user a [deleted] nos comentarios

GET /users?level=X                                      // Listar users de nivel X                                            
    GET /users/nivel/:X
GET /users/:id                                          // Consultar user
    GET /users/:id
DELETE /users/:id                                       // Remover user
    DELETE /users/:id
PUT /users/:uname/upgrade                               // Upgrade user: Consumidor -> Produtor
    PUT /users/:uname?level=produtor
PUT /users/:uname/downgrade                             // Downgrade user: Produtor -> Consumidor
    PUT /users/:uname?level=consumidor

GET /recursos                                           // Listar todos os recursos (conforme o visualizaçao)
GET /recursos?hashtag=X                                 // Listar todos os recursos com hashtag X (conforme o visualizaçao)
GET /recursos?tipo=X                                    // Listar todos os recursos com tipo X (conforme o visualizaçao)
GET /recursos/tipos                                     // Listar os tipos existentes
GET /recursos/pessoais                                  // Consultar os seus proprios recursos (apenas para produtor ou admin)

GET /recurso/:id                                        // Consultar um recurso
GET /recurso/:id/owner                                  // Consultar owner de um recurso
GET /recurso/pessoal/:id                                // Consultar um recurso pessoal
POST /recurso                                           // Inserir um recurso
PUT /recurso                                            // Alterar um recurso
DELETE /recurso/:id                                     // Remover um recurso


//----------------------------------- APP-server

GET /                                                   // Pagina inicial -> login/registar

GET /login                                              // Pagina de login
POST /login                                             // Efetuar login
    POST /users/login

GET /register                                           // Pagina de registar
POST /register                                          // Efetuar registo
    POST /users/registar

GET /mainPage                                           // Main Page
GET /mainPage?tab=t                                     // Main Page aberto na tab t
GET /mainPage?tab=t&tab2=t2                             // Main Page aberto na tab t e t2
    GET /recursos
    GET /recursos/tipos
    GET /recursos/pessoais
    GET /users?level=produtor
    GET /users?level=consumidor

GET /recursos?hashtag=X                                 // Listar recursos com hashtag X


GET /recurso/meu/:rec                                   // Consultar recurso pessoal
GET /recurso/:rec                                       // Consultar um recurso
    GET /comentarios/recurso/:rec
    GET /recurso/pessoal/:rec
    GET /recurso/:rec
GET /recurso/:rec/editar                                // Página de editar recurso
    GET /recurso/pessoal/:rec
GET /recurso/:id/remover                                // Eliminar recurso
    DELETE /recurso/:id
POST /recurso                                           // Alterar recurso
    PUT /recurso

GET /recurso/remover/:c                                 // Remover comentário-----------
    DELETE /comentarios/:c                              
GET /recurso/:rec/remover/comentarios                   // Remover todos os comentarios do recurso
    GET /recurso/:rec/owner
    DELETE /comentarios/recurso/:rec/owner/:owner
POST /recurso/:rec/comentarios                          // Adicionar comentário
    POST /comentarios/recurso/:rec

GET /recurso/upload                                     // Pagina de upload ----------------------> ELiminar esta rota?
POST /recurso/upload                                    // Upload de um recurso


GET /user/:user                                         // Consultar um user
    GET /users/:user
    GET /comentarios/user/:user
    GET /recursos/user/:user                            //-----------------------------------------> Fazer
GET /user/:user/remover                                 // Eliminar um user
    DELETE /users/:user
GET /user/:user/upgrade                                 // consumidor -> produtor
    PUT /users/:user/upgrade
GET /user/:user/downgrade                               // produtor -> consumidor
    PUT /users/:user/downgrade
GET /user/:user/remover/comentarios                     // Eliminar os comentarios de um user
    DELETE /comentarios/user/:user
