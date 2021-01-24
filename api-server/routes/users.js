var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios');
const Comentario = require('../controllers/comentarios');

/* GET home page. */

// Listar users de nivel X
router.get('/', function(req, res){
  if(req.user.vis == 1)
    axios.get("http://localhost:8002/users/nivel?level=" + req.query.level)
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

// Consultar user comentarios
router.get('/:id/comentarios', function(req, res){
  Comentario.listarByUser(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({error: e}))
})


//----------------------------------- Alterar users BD

// Remover user
router.get('/:id/remover', function(req, res){
  if(req.user.vis == 1)
    axios.delete("http://localhost:8002/users/" + req.params.id )
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Upgrade user: Consumidor -> Produtor
router.get('/:uname/upgrade', function(req, res){
  if(req.user.vis == 1){
    axios.put("http://localhost:8002/users/" + req.params.uname + "/level?new=produtor")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  }
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Downgrade user: Produtor -> Consumidor
router.get('/:uname/downgrade', function(req, res){
  if(req.user.vis == 1){
    axios.put("http://localhost:8002/users/" + req.params.uname + "/level?new=consumidor")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  }
  else
    res.status(500).jsonp({error: "Não autorizado"})
})


module.exports = router;
