var express = require('express');
var router = express.Router();
var User = require('../controllers/user')

var passport = require('passport')
var jwt = require('jsonwebtoken')


//consultar user
router.get('/:id', function(req, res) {
  User.consultar(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//listar users nivel X
router.get('/nivel/:level', function(req, res) {
  User.listarLevel(req.params.level, req.query.sortBy)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//----------------------------------- Alterar BD


//remover user
router.delete('/:uname', function(req, res) {
  User.remove(req.params.uname)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//alterar nivel user
router.put('/:uname', function(req, res) {
  if(req.query.level)
    User.alterarLevel(req.params.uname, req.query.level)
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
                            .then(res.status(201).jsonp({token: token}))
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



module.exports = router;

