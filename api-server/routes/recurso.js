var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')



// Consultar um recurso
router.get('/:id', function(req, res) {
    Recurso.consultar(req.user.vis, req.params.id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e =>  res.status(500).jsonp({error: e}))
});

// Consultar o recurso owner de um recurso          ---------------->eliminar mas not yet
router.get('/:id/owner', function(req, res) {
  Recurso.consultarOwner(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e =>  res.status(500).jsonp({error: e}))
});


// Consultar um recurso pessoal
router.get('/pessoal/:id', function(req,res,next) {
  if (req.user.level != "consumidor") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res) {

  Recurso.listarRecPessoal(req.user.username, req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(e => res.status(500).jsonp({error: e}))
});





// Inserir um recurso
router.post('/', function(req, res){
  Recurso.inserir(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Alterar um recurso
router.put('/', function(req, res){
  console.log(req.body)
  Recurso.alterar(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// Remover um recurso 
router.delete('/:id', function(req,res,next) {
  if (req.user.level != "consumidor") next();
  else res.status(500).jsonp({error: "Não autorizado"})
}, function(req, res) {

  if(req.user.level === "admin")
    Recurso.remover(req.params.id)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
  if(req.user.level === "produtor")
    Recurso.removerPessoal(req.params.id, req.user.username)
      .then(dados => res.status(200).jsonp(dados))
      .catch(e => res.status(500).jsonp({error: e}))
});

module.exports = router;
