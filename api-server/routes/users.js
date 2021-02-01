var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios');
const Comentario = require('../controllers/comentarios');

/* GET home page. */

// Listar users de nivel X
router.get('/', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.get("http://localhost:8002/users/nivel/" + req.query.level + "?sortBy=" + req.query.sortBy)
    .then(dados => res.status(200).jsonp({nivel: req.user.level, dados:dados.data}))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Consultar username do user ---------------------------------> eliminar
router.get('/user', function(req, res){
  res.status(200).jsonp(req.user.username)
})

// Consultar user
router.get('/:id', function(req, res){
  axios.get("http://localhost:8002/users/" + req.params.id)
    .then(dados =>{
      Comentario.listarByUser(req.params.user)
        .then(cmts => 
          res.status(200).jsonp({nivel:req.user.level, username:req.user.username, dados:dados.data, cmts:cmts}))
        .catch(e => res.status(501).jsonp({error: e}))
      
    })
    .catch(e => res.status(501).jsonp({error: e}))
})




//----------------------------------- Alterar users BD

// Remover user
router.delete('/:id', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.delete("http://localhost:8002/users/" + req.params.id )
    .then(dados => res.status(200).jsonp(dados.data))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Upgrade user: Consumidor -> Produtor
router.put('/:uname/upgrade', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.put("http://localhost:8002/users/" + req.params.uname + "?level=produtor")
    .then(dados => res.status(200).jsonp(dados.data))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Downgrade user: Produtor -> Consumidor
router.put('/:uname/downgrade', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.put("http://localhost:8002/users/" + req.params.uname + "?level=consumidor")
    .then(dados => res.status(200).jsonp(dados.data))
    .catch(e => res.status(501).jsonp({error: e}))
})


module.exports = router;
