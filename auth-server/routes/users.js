var express = require('express');
var router = express.Router();
var User = require('../controllers/user')

var passport = require('passport')
var jwt = require('jsonwebtoken')



function verificaToken(req, res, next){
  var myToken = req.query.token || req.body.token;
  jwt.verify(myToken, 'PRI2020', function(e, payload){
    if(e) res.status(401).jsonp({error: 'Erro na verificação do token: ' + e})
    else{
      if(payload.level === "admin")
        req.user = { level: payload.level, username: payload.username, vis:1 }
      else
        req.user = { level: payload.level, username: payload.username, vis:2 }

      console.log("token good verificado")
      next()
    } 
  })
}


// Listar users
router.get('/', verificaToken, function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res){
  
  User.listarLevel("consumidor", req.query.sortBy)
      .then(cs =>{
          User.listarLevel("produtor", req.query.sortBy)
            .then(ps => res.status(200).jsonp({consumidores:cs, produtores:ps}))
            .catch(e => res.status(500).jsonp({error: e}))
      } )
      .catch(e => res.status(500).jsonp({error: e}))
})

//consultar user
router.get('/:id', function(req, res) {
  User.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Consultar user pelo email
router.get('/email/:email', function(req, res){
  User.consultarByEmail(req.params.email)
  .then(dados => res.status(200).jsonp(dados))
  .catch(e => res.status(500).jsonp({error: e}))
})

//listar users nivel X
router.get('/nivel/:level', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res) {
  User.listarLevel(req.params.level, req.query.sortBy)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//----------------------------------- Alterar BD


//remover user
router.delete('/:uname', verificaToken, function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res) {
  User.remove(req.params.uname)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//alterar nivel ou pedido user
router.put('/:uname', verificaToken, function(req,res,next) {
  if (req.user.level === "admin") next();
  else if (req.query.pedido && !req.query.level && (req.user.username===req.params.uname) && (req.user.level === "consumidor")) next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res) {
  if (req.query.level)
    User.alterarLevel(req.params.uname, req.query.level)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
  if (req.query.pedido)
    User.alterarPedido(req.params.uname, req.query.pedido)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
})



//login
router.post('/login', function(req,res) {
    jwt.sign({username: req.body.username, 
              level:  req.body.level,
              sub: 'Projeto PRI2020'}, "PRI2020", function(e,token) {
                if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                else{
                  var d = new Date().toISOString().slice(0, 16).split('T').join(' ')
                  User.consultar(req.body.username)
                    .then(dados => {
                      data = dados.dataLastAcess;
                      User.alterarLastAcess(req.body.username, d)
                        .then(dados => {
                          User.alterarLastLastAcess(req.body.username,data)
                            .then(dados => res.status(201).jsonp({token: token}))
                            .catch(e => res.status(500).jsonp({error: "Erro no updaling last last acess " + e}))
                        })
                        .catch(e => res.status(500).jsonp({error: "Erro updating last acess: " + e}) )
                    })
                    .catch(e => res.status(500).jsonp({error: "Erro no consultar: " + e}))
                  
                }
              })
})



//criar user
router.post('/registar', function(req,res) {
    console.log(req.body)
    req.body.dataRegisto = new Date().toISOString().slice(0, 16).split('T').join(' ')
    req.body.dataLastAcess = ''
    req.body.pedido = "nao"
    User.consultar(req.body.username)
      .then(dados => {
        if (dados == null)
        {
          User.inserir(req.body)
            .then(dados => res.status(201).jsonp({dados: dados}))
            .catch(e => res.status(500).jsonp({error: e}))
        }
        else res.status(500).jsonp("User ja existente")
      }).catch( e => {console.log("catch"); res.status(500).jsonp({error: e})})
    
})

// Facebook login
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

/*
  Callback chamada depois do login do FB ser autenticado
  Caso a autenticação do FB falhe, redireciona o user para a página de login
  Caso o username esteja vazio significa que é o primeiro login do user, e redireciona-o para uma página para inserir a info em falta
*/
router.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: 'http://localhost:8001/index/login'}),
  function(req, res){

    const email = encodeURIComponent(req.user.email)

    /*
      Se o email não estiver registado na base de dados cria um novo utilizador
    */
    User.consultarByEmail(email)
      .then(dados => {
        const user = dados

        if(!user) {
          var newUser = {
            "username": '',
            "level": "consumidor",
            "email": profile.emails[0].value,
            "dataRegisto": new Date().toISOString().slice(0, 10),
            "dataLastAcess": ''
          }
          User.inserir(newUser)
        }
      })

    /*
      Se username for vazio significa que é o primeiro login depois de
      entrar com uma rede social
    */
    if(req.user.username == ''){
      // Redirecionar para uma página para introduzir username e filiação
      res.redirect('http://localhost:8001/complete-reg?email=' + email)
    }

    /* 
      Criar token e adicionar-lo como cookie
      Redirecionar para a mainPage
    */
    else{
      jwt.sign({username: req.user.username, 
                level:  req.user.level,
                sub: 'Projeto PRI2020'},
                "PRI2020",
                function(e,token) {
                  if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                  else{
                    var d = new Date().toISOString().slice(0, 10)
                    User.alterarLastAcess(req.body.username, d)
                      .then(res.status(201).cookie('token', token).redirect('http://localhost:8001/mainPage'))
                      .catch(e => res.status(500).jsonp({error: "Erro updating last acess: " + e}) )
                  }
                })
    }
  }
);

/*
  Adicionar username e filiação de um utilizador registado
  através de uma rede social
*/
router.post('/complete-reg', function(req, res){
  console.log(req)
  User.alterarUnameFil(req.body.email, req.body.username, req.body.filiacao)
    .then(res.status(201).send())
    .catch(e => res.status(500).jsonp({error: "Error updating new username and filiação " + e}) )
})

module.exports = router;

