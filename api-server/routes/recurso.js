var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios')



// Consultar um recurso
router.get('/:id', function(req, res) {
    Recurso.consultar(req.user.vis, req.params.id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e =>  res.status(500).jsonp({error: e}))
});


// Consultar um recurso proprio recurso 
router.get('/produtor/:id', function(req, res) {
  if(req.user.level === "consumidor")
    res.status(500).jsonp({error: "Não autorizado"})
  else{
    Recurso.listarRecPessoal(req.user.username, req.params.id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
  }
});


// Inserir um recurso
router.post('/recurso', function(req, res){
  Recurso.inserir(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um recurso
router.put('/recurso', function(req, res){
  Recurso.alterar(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Remover um recurso 
router.delete('/recurso/:id', function(req, res) {
  if(req.user.level === "admin")
    Recurso.remover(req.params.id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
  else
    res.status(500).jsonp("Não autorizado")
});

module.exports = router;
