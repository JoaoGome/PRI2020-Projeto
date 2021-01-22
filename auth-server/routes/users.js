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

//login
router.post('/login', passport.authenticate('local'), function(req,res) {
    console.log(req.user)
    jwt.sign({username: req.user.username, 
              level:  req.user.level,
              sub: 'Projeto PRI2020'}, "PRI2020", function(e,token) {
                if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                else res.status(201).jsonp({token: token})
              })
})

//criar user
router.post('/registar', function(req,res) {
    console.log(req.body)
    req.body.dataRegisto = new Date().toISOString().slice(0, 10)
    req.body.dataLastAcess = ''
    console.log(req.body)
    User.inserir(req.body)
      .then(dados => res.status(201).jsonp({dados: dados}))
      .catch(e => res.status(500).jsonp({error: e}))
})



module.exports = router;
