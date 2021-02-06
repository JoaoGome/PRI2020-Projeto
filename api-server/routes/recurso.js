var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var Comentario = require('../controllers/comentarios')



// Consultar um recurso
router.get('/:id', function(req, res) {
  Recurso.consultar(req.user.vis, req.params.id)
    .then(dados =>{
        Comentario.listarByRecurso(req.params.id)
          .then(cmts => res.status(200).jsonp({dados:dados, level:req.user.level, user:req.user.username, cmts:cmts}))
          .catch(e => res.status(501).jsonp({error: e}))
    })
    .catch(e => res.status(502).jsonp({error: e}))
});


// Alterar visibilidade recurso
router.get('/:id/alterar', function(req, res) {
  Recurso.alterarRecPessoalVis(req.user.username, req.params.id, req.query.visibilidade)
    .then(dados => res.status(200).jsonp({dados:dados, username:req.user.username}))
    .catch(e =>  res.status(500).jsonp({error: e}))
});


// Consultar um recurso pessoal
router.get('/pessoal/:id', function(req,res,next) {
  if (req.user.level === "admin") res.redirect(`/recurso/${req.params.id}?token=${req.query.token}`)
  else next();
}, function(req, res) {

  Recurso.consultarRecPessoal(req.user.username, req.params.id)
    .then(dados =>{
      if(dados == null) res.status(500).jsonp({error: "Não existe ou não autorizado"})
      else 
        Comentario.listarByRecurso(req.params.id)
          .then(cmts => res.status(200).jsonp({dados:dados, level:req.user.level, user:req.user.username, cmts:cmts}))
          .catch(e =>  res.status(500).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
});


// Inserir um recurso
router.post('/', function(req, res){
  req.body.owner = req.user.username;
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
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res) {

  if(req.user.level === "admin")
    Recurso.remover(req.params.id)
      .then(dados => {
        // remover os comentarios do recurso
        Comentario.removerRecurso(req.params.id)
          .then(res.status(200).jsonp(dados))
          .catch(e => res.render(500).jsonp({error: e}))
      })
      .catch(e => res.status(500).jsonp({error: e}))

  if(req.user.level === "produtor")
    Recurso.removerPessoal(req.params.id, req.user.username)
      .then(dados => {
        // remover os comentarios do recurso
        Comentario.removerRecurso(req.params.id)
          .then(res.status(200).jsonp(dados))
          .catch(e => res.render(500).jsonp({error: e}))
      })
      .catch(e => res.status(500).jsonp({error: e}))
});

// alterar classificaçao de um recurso
router.get('/:id/classificar/:c', function(req,res) {
  var c = Number(req.params.c);
  Recurso.consultar(req.user.vis, req.params.id)
    .then(dados =>{
      var teste = dados;
      found = 0;
      totalSum = 0;
      for (r in teste.classificacoes) 
      {
        if (teste.classificacoes[r].username == req.user.username)
        {
          found = 1;
          teste.classificacoes[r].classificacao = c;
          totalSum += teste.classificacoes[r].classificacao;
        } 
        else totalSum += teste.classificacoes[r].classificacao;
      }

      if (!found)
      {
        console.log("TotalSum antes de somar: ", totalSum);
        console.log("Valor do c: ", c);
        teste.classificacoes.push({username:req.user.username, classificacao: c});
        totalSum += c;
        console.log("TotalSum depois de somar: ", totalSum)
      }

      media = totalSum / teste.classificacoes.length;
      teste.classificacao = media.toFixed(1)

      Recurso.alterar(teste)
      .then(dados => res.status(200).jsonp({dados:dados}))
      .catch(e => res.status(502).jsonp({error:e}))

    })

    
    
    .catch(e => res.status(502).jsonp({error: e}))
})

module.exports = router;
