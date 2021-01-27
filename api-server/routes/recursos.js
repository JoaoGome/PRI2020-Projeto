var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios')

/* GET home page. */


// Listar todas os recursos
router.get('/', function(req, res) {

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
    else if(req.query.procurar)
      Recurso.listarRecursosTitulo(req.user.vis, req.query.procurar)
        .then(dados => res.status(200).jsonp(dados))
        .catch(e => res.status(500).jsonp({error: e}))

    // Listar todos os recursos
    else
      Recurso.listarRec(req.user.vis, req.query.hashtag)
        .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level}))
        .catch(e => res.status(500).jsonp({error: e}))

});

// Listar tipos
router.get('/tipos', function(req, res) {
  Recurso.listarTipos()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});


// Consultar os seus proprios recursos
router.get('/pessoais', function(req, res) {
  if(req.user.level === "consumidor")
    res.status(500).jsonp({error: "Não autorizado"})
  else{
    Recurso.listarRecPessoais(req.user.username)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
  }
});


module.exports = router;
