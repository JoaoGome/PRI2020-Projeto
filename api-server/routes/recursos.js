var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios')

/* GET home page. */


// Listar todas os recursos
router.get('/', function(req, res) {
  
  // Listar os tipos existentes
  Recurso.listarTipos()
    .then(tipos =>{
      var order = "titulo"
      if(req.query.sortBy) order = req.query.sortBy
      
      if(order === "owner"){
        Recurso.listarRecBy(req.user.vis, order)
            .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
            .catch(e => res.status(500).jsonp({error: e}))
      }
      else{
        // Listar todos os recursos com determinada hashtag
        if(req.query.hashtag)
          Recurso.listarRecHashtags(req.user.vis, req.query.hashtag, order)
            .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
            .catch(e => res.status(500).jsonp({error: e}))

        // Listar todos os recursos com determinado tipo --------------------------------------> not used
        else if(req.query.tipo)
          Recurso.listarRecursosTipo(req.user.vis, req.query.tipo, order)
            .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
            .catch(e => res.status(500).jsonp({error: e}))

        // Listar todos os recursos com certo texto no titulo
        else if(req.query.procurar)
          Recurso.listarRecursosTitulo(req.user.vis, req.query.procurar, order)
            .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
            .catch(e => res.status(500).jsonp({error: e}))

        // Listar todos os recursos
        else
          Recurso.listarRec(req.user.vis, order)
            .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
            .catch(e => res.status(500).jsonp({error: e}))
      }
    })
    .catch(e => res.status(500).jsonp({error: e}))
});

// Listar tipos                                                     --------------------------------------> not used
router.get('/tipos', function(req, res) {
  Recurso.listarTipos()
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});


// Consultar os seus proprios recursos
router.get('/pessoais', function(req,res,next) {
  if (req.user.level != "consumidor") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res) {

  var order = "titulo"
  if(req.query.sortBy) order = req.query.sortBy
  // Listar os tipos existentes
  Recurso.listarTipos()
    .then(tipos =>
      Recurso.listarRecPessoais(req.user.username, order)
        .then(dados => res.status(200).jsonp({dados:dados, tipos:tipos, level:req.user.level}))
        .catch(e => res.status(500).jsonp({error: e}))
    )
    .catch(e => res.status(500).jsonp({error: e}))
});

// Consultar recursos de um utilizador
router.get('/user/:user', function(req, res) {
  var vis = req.user.vis
  if(req.params.user === req.user.username) vis = 1
  Recurso.listarRecUser(vis, req.params.user)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;
