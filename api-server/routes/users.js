var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios');
const Comentario = require('../controllers/comentarios');

/* GET home page. */

// Listar users de nivel X
router.get('/', function(req, res){
  if(req.user.level === "admin")
    axios.get("http://localhost:8002/users/nivel/" + req.query.level)
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Consultar user
router.get('/:id', function(req, res){
  axios.get("http://localhost:8002/users/" + req.params.id)
    .then(dados =>res.status(200).jsonp({nivel: req.user.level, username: req.user.username, dados: dados.data}))
    .catch(e => res.status(501).jsonp({error: e}))
})

/*
// Consultar user comentarios
router.get('/:user/comentarios', function(req, res){
  Comentario.listarByUser(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Remover user comentarios
router.delete('/:user/comentarios/remover', function(req, res){
  Comentario.removerUser(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Passar user a [deleted] nos comentarios
router.put('/:user/comentarios/deleted', function(req, res){
  Comentario.deletedUser(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({error: e}))
})

*/


//----------------------------------- Alterar users BD

// Remover user
router.delete('/:id', function(req, res){
  if(req.user.vis == 1)
    axios.delete("http://localhost:8002/users/" + req.params.id )
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Upgrade user: Consumidor -> Produtor
router.put('/:uname/upgrade', function(req, res){
  if(req.user.vis == 1){
    axios.put("http://localhost:8002/users/" + req.params.uname + "?level=produtor")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  }
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Downgrade user: Produtor -> Consumidor
router.put('/:uname/downgrade', function(req, res){
  if(req.user.vis == 1){
    axios.put("http://localhost:8002/users/" + req.params.uname + "?level=consumidor")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  }
  else
    res.status(500).jsonp({error: "Não autorizado"})
})


module.exports = router;
