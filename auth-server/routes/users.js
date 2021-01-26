var express = require('express');
var router = express.Router();
var User = require('../controllers/user')

var passport = require('passport')
var jwt = require('jsonwebtoken')

//listar users nivel X
router.get('/nivel', function(req, res) {
  User.listarLevel(req.query.level)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})

//listar consultar user
router.get('/:id', function(req, res) {
  User.consultar(req.params.id)
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
router.put('/:uname/level', function(req, res) {
  User.alterarLevel(req.params.uname, req.query.new)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
})



//login
router.post('/login', passport.authenticate('local'), function(req,res) {
    console.log(req.user)
    jwt.sign({username: req.user.username, 
              level:  req.user.level,
              sub: 'Projeto PRI2020'}, "PRI2020", function(e,token) {
                if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                else{
                  var d = new Date().toISOString().slice(0, 10)
                  User.alterarLastAcess(req.body.username, d)
                    .then(res.status(201).jsonp({token: token}))
                    .catch(e => res.status(500).jsonp({error: "Erro updating last acess: " + e}) )
                }
              })
})

//criar user
router.post('/registar', function(req,res) {
    console.log(req.body)
    req.body.dataRegisto = new Date().toISOString().slice(0, 10)
    req.body.dataLastAcess = ''
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

