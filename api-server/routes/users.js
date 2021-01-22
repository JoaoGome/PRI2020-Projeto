var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios')

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


// Remover user
router.get('/:id/remover', function(req, res){
  if(req.user.vis == 1)
    axios.get("http://localhost:8002/users/" + req.params.id + "/remover")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Upgrade user: Consumidor -> Produtor
router.get('/:uname/upgrade', function(req, res){
  if(req.user.vis == 1){
    axios.get("http://localhost:8002/users/" + req.params.uname + "/level?new=produtor")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  }
  else
    res.status(500).jsonp({error: "Não autorizado"})
})

// Downgrade user: Produtor -> Consumidor
router.get('/:uname/downgrade', function(req, res){
  if(req.user.vis == 1){
    axios.get("http://localhost:8002/users/" + req.params.uname + "/level?new=consumidor")
      .then(dados => res.status(200).jsonp(dados.data))
      .catch(e => res.status(501).jsonp({error: e}))
  }
  else
    res.status(500).jsonp({error: "Não autorizado"})
})


module.exports = router;
