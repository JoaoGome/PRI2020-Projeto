var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios');
var Comentario = require('../controllers/comentarios');

/* GET home page. */

// Consultar user comentarios
router.get('/:id/comentarios', function(req, res){
  var cmts = []
  Comentario.listarByUser(req.params.id)
    .then(comentarios =>{
      for (c in comentarios)
        cmts.push({data: comentarios[c].data, text: comentarios[c].text, recursoID: comentarios[c].recursoID, recursoTitulo: comentarios[c].recursoTitulo,_id: comentarios[c]._id})
      
        res.status(200).jsonp({nivel:req.user.level, username:req.user.username, cmts:cmts})    
    }).catch(e => res.status(501).jsonp({error: e}))
})


//----------------------------------- Alterar users BD

// Remover comentarios e recursos do user
router.delete('/:id', function(req,res,next) {
  if (req.user.level === "admin" || req.user.username === req.params.id) next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res){

  // nos seus comentarios username passa a [deleted]
  Comentario.deletedUser(req.params.id)
    .then(c =>{
        // eliminar recursos do user
        Recurso.removerRecUser(req.params.id)
          .then(r =>{
            // eliminar comentarios do recurso
            Comentario.removerRecurso(req.params.id)
              .then(dados =>res.status(200).jsonp(dados.data))
              .catch(e => res.status(502).jsonp({error: e}))
          })
          .catch(e => res.status(502).jsonp({error: e}))
    })
    .catch(e => res.status(501).jsonp({error: e}))
})



module.exports = router;
