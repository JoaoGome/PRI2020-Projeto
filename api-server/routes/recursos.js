var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios')

/* GET home page. */

function retiraFiltros (vis, req) {
  return 0
}

// Listar todas os recursos
router.get('/', function(req, res) {
  
  // Listar os tipos existentes
  Recurso.listarTipos()
    .then(tipos =>{
      var sort = "titulo,titulo"
      if(req.query.sortBy) sort = req.query.sortBy
      sort = sort.split(",")
      var order = "asc,asc"
      if(req.query.orderBy) order = req.query.orderBy
      order = order.split(",")
      if(order[0] === "asc" ) order[0] = 1
      else order[0] = -1
      if(order[1] === "asc" ) order[1] = 1
      else order[1] = -1
      var filter = tipos
      if(req.query.filterBy) filter = req.query.filterBy.split(',')
      var classificacao = -1
      if(req.query.classificarBy) classificacao = Number(req.query.classificarBy)
      
      var visBy = [2]
      if(req.user.vis == 1) visBy = [1,2]
      if(req.query.visBy === "privado" && req.user.vis == 1) visBy = [1]
      if(req.query.visBy === "publico") visBy = [2]

      // Listar todos os recursos com determinada hashtag
      if(req.query.hashtag)
        Recurso.listarRecHashtags(visBy, req.query.hashtag, filter, sort[0], sort[1], order[0], order[1], classificacao)
          .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
          .catch(e => res.status(500).jsonp({error: e}))

      // Listar todos os recursos com certo texto no titulo
      else if(req.query.procurar)
        Recurso.listarRecursosTitulo(visBy, req.query.procurar, filter, sort[0], sort[1], order[0], order[1], classificacao)
          .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
          .catch(e => res.status(500).jsonp({error: e}))

      // Listar todos os recursos
      else
        Recurso.listarRecBy(visBy, filter, sort[0], sort[1], order[0], order[1], classificacao)
          .then(dados => res.status(200).jsonp({dados:dados, level:req.user.level, tipos:tipos}))
          .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
});


// Consultar os seus proprios recursos
router.get('/pessoais', function(req,res,next) {
  if (req.user.level != "consumidor") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res) {

  var sort = "titulo,titulo"
  if(req.query.sortBy) sort = req.query.sortBy
  sort = sort.split(",")
  var order = "asc,asc"
  if(req.query.orderBy) order = req.query.orderBy
  order = order.split(",")
  if(order[0] === "asc" ) order[0] = 1
  else order[0] = -1
  if(order[1] === "asc" ) order[1] = 1
  else order[1] = -1
  var classificacao = -1
  if(req.query.classificarBy) classificacao = Number(req.query.classificarBy)
      
  var visBy = [1,2]
  if(req.query.visBy === "privado") visBy = [1]
  if(req.query.visBy === "publico") visBy = [2]

  // Listar os tipos existentes
  Recurso.listarTipos()
    .then(tipos =>{
      var filter = tipos
      if(req.query.filterBy) filter = req.query.filterBy.split(',')

      // Listar os recursos pessoais
      Recurso.listarRecPessoais(visBy, req.user.username, filter, sort[0], sort[1], order[0], order[1], classificacao)
        .then(dados => res.status(200).jsonp({dados:dados, tipos:tipos, level:req.user.level}))
        .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
});

// Consultar recursos de um utilizador
router.get('/user/:user', function(req, res) {
  var vis = req.user.vis
  if(req.params.user === req.user.username) vis = 1

  var sort = "titulo,titulo"
  if(req.query.sortBy) sort = req.query.sortBy
  sort = sort.split(",")
  var order = "asc,asc"
  if(req.query.orderBy) order = req.query.orderBy
  order = order.split(",")
  if(order[0] === "asc" ) order[0] = 1
  else order[0] = -1
  if(order[1] === "asc" ) order[1] = 1
  else order[1] = -1
  var classificacao = -1
  if(req.query.classificarBy) classificacao = Number(req.query.classificarBy)
  
  var visBy = [2]
  if(vis == 1) visBy = [1,2]
  if(req.query.visBy === "privado" && vis == 1) visBy = [1]
  if(req.query.visBy === "publico") visBy = [2]
  
  // Listar os tipos existentes
  Recurso.listarTipos()
    .then(tipos =>{
      var filter = tipos
      if(req.query.filterBy) filter = req.query.filterBy.split(',')
      // Listar os recursos de um utilizador
      Recurso.listarRecUser(visBy, req.params.user, filter, sort[0], sort[1], order[0], order[1], classificacao)
        .then(dados => res.status(200).jsonp({dados:dados, nivel:req.user.level, tipos:tipos, username:req.user.username}))
        .catch(e => res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
});

// Consultar todos os recursos uploaded apos uma certa data
router.get('/')

module.exports = router;
