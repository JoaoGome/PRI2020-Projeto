var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var Comentario = require('../controllers/comentarios')
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

// Adicionar um comentário
router.post('/:id/comentario', function(req, res) {
  req.body.userID = req.user.username
  req.body.recursoID = req.params.id
  req.body.data =  new Date().toISOString().slice(0, 10)
  Comentario.inserir(req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e =>  res.status(500).jsonp({error: e}))
});

// Consultar os comentários de um recurso
router.get('/:id/comentarios', function(req, res) {
  Comentario.listarByRecurso(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e =>  res.status(500).jsonp({error: e}))
});

// Inserir um recurso
router.post('/', function(req, res){
  Recurso.inserir(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um recurso
router.put('/', function(req, res){
  Recurso.alterar(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Remover um recurso 
router.delete('/:id', function(req, res) {
  if(req.user.level === "admin")
    Recurso.remover(req.params.id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
  else
    res.status(500).jsonp("Não autorizado")
});

module.exports = router;
