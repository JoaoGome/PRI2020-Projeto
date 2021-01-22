var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios')

/* GET home page. */

router.get('/', function(req,res) {
  res.send('<p>Hello user: </p>' + req.user.username);
})

// Listar todas os recursos
router.get('/recursos', function(req, res) {

    // Listar todos os recursos com determinada hashtag
    if(req.query.hashtag)
      Recurso.listarRecHashtags(req.user.vis, req.query.hashtag)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))

    // Listar todos os recursos com determinado tipo
    else if(req.query.tipo)
    Recurso.listarRecursosTipo(req.user.vis, req.query.tipo)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))

    // Listar todos os recursos
    else
      Recurso.listarRec(req.user.vis, req.query.hashtag)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))

});

// Listar tipos
router.get('/recursos/tipos', function(req, res) {
  Recurso.listarTipos()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

// Consultar um recurso
router.get('/recurso/:id', function(req, res) {
  Recurso.consultar(req.user.vis, req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

// Consultar os seus proprios recursos
router.get('/produtor', function(req, res) {
  Recurso.listarRecPessoais(req.user.username)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});




// Inserir um recurso
router.post('/recursos', function(req, res){
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
  Recurso.remover(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;
