var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios');
const Comentario = require('../controllers/comentarios');


// Comment Section


// Consultar os comentários de um recurso
router.get('/recurso/:rec', function(req, res) {
  Comentario.listarByRecurso(req.params.rec)
    .then(dados => res.status(200).jsonp({dados:dados, nivel:req.user.level, user:req.user.username}))
    .catch(e =>  res.status(500).jsonp({error: e}))
});

// Adicionar um comentário
router.post('/recurso/:rec', function(req, res) {
  req.body.userID = req.user.username
  req.body.recursoID = req.params.rec
  req.body.data =  new Date().toISOString().slice(0, 16).split('T').join(' ')
  Comentario.inserir(req.body)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e =>  res.status(500).jsonp({error: e}))
});

// Eliminar comentario
router.delete('/:c', function(req,res){
  if (req.user.level === "admin")
    Comentario.remover(req.params.c)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e =>  res.status(500).jsonp({error: e}))
  else 
    Comentario.removerPessoal(req.params.c)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e =>  res.status(500).jsonp({error: e}))
})


// Remover comentarios do recurso
router.delete('/recurso/:rec/owner/:owner', function(req, res){
  if (req.user.username === req.params.owner || req.user.level === "admin")
    Comentario.removerRecurso(req.params.rec)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(501).jsonp({error: e}))
})


// Consultar user comentarios
router.get('/user/:user', function(req, res){
  Comentario.listarByUser(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Remover user comentarios
router.delete('/user/:user', function(req, res){
  if (req.user.username === req.params.user || req.user.level === "admin")
    Comentario.removerUser(req.params.user)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(501).jsonp({error: e}))
  else 
    res.status(500).jsonp({error: "Não autorizado"})

  
})

// Passar user a [deleted] nos comentarios
router.put('/user/:user', function(req, res){
  Comentario.deletedUser(req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(501).jsonp({error: e}))
})




module.exports = router;
