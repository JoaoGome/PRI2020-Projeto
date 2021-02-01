var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recurso')
var axios = require('axios');
var Comentario = require('../controllers/comentarios');

/* GET home page. */

// Listar users de nivel X
router.get('/', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.get("http://localhost:8002/users/nivel/" + req.query.level + "?sortBy=" + req.query.sortBy)
    .then(dados => res.status(200).jsonp({nivel: req.user.level, dados:dados.data}))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Consultar username do user ---------------------------------> eliminar
router.get('/user', function(req, res){
  res.status(200).jsonp(req.user.username)
})

// Consultar user
router.get('/:id', function(req, res){
  axios.get("http://localhost:8002/users/" + req.params.id)
    .then(dados =>{
      Comentario.listarByUser(req.params.id)
        .then(comentarios =>{

          var cmts = []
          var l = comentarios.length
          console.log("comentarios lenght: " + l )

          for(var i = 0; i < l; i++)
            var c = comentarios[i]
            var rID = c.recursoID
            var cID = c._id
            var cText = c.text
            var cUser = c.userID
            console.log("rID: " + rID + ", cID: " + cID + ", cText: " + cText + ", cUser: " + cUser)
            console.log("cmt" + i + " id: " + rID)
            Recurso.consultar(1, rID)
              .then(rec => { 
                console.log(rec)
                if( rec.visibilidade == 2 || req.user.level === "admin" || req.user.username === rec.owner ){
                  console.log("here" + i)
                  cmts.push({_id:cID, text:cText, recursoID:rID, userID:cUser})
                }
                else console.log("ooooooooooooooooooiiiiiiiii")
              })
              .catch(console.log("recursos não existente")) 
          /*comentarios.forEach( function(cmt, index, object) {
            
            Recurso.consultar(1, cmt.recursoID)
              .then(rec => { 
                if( rec.visibilidade == 2 || req.user.level === "admin" || req.user.username === rec.owner ){
                  cmt.recursoID = rec.titulo
                  console.log("cmt"+index+": " + cmt)
                }
                else
                  comentarios.splice(index, 1);
              })
              .catch(console.log("recursos não existente"))    
          })*/
          console.log("here")
          console.log("CMTS: " + cmts)

          res.status(200).jsonp({nivel:req.user.level, username:req.user.username, dados:dados.data, cmts:cmts})

        })
        .catch(e => res.status(501).jsonp({error: e}))
    })
    .catch(e => res.status(500).jsonp({error: e}))
})




//----------------------------------- Alterar users BD

// Remover user
router.delete('/:id', function(req,res,next) {
  if (req.user.level === "admin" || req.user.username === req.params.id) next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res){

  // nos seus comentarios username passa a [deleted]
  Comentario.deletedUser(req.params.id)
    .then(c =>{ console.log("here")
        Recurso.removerRecUser(req.params.id)
        .then(r =>{
          axios.delete("http://localhost:8002/users/" + req.params.id )
            .then(dados => res.status(200).jsonp(dados.data))
            .catch(e => res.status(500).jsonp({error: e}))      
        })
      .catch(e => res.status(502).jsonp({error: e}))
    })
    .catch(e => res.status(501).jsonp({error: e}))
})

// Upgrade user: Consumidor -> Produtor
router.put('/:uname/upgrade', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.put("http://localhost:8002/users/" + req.params.uname + "?level=produtor")
    .then(dados => res.status(200).jsonp(dados.data))
    .catch(e => res.status(501).jsonp({error: e}))
})

// Downgrade user: Produtor -> Consumidor
router.put('/:uname/downgrade', function(req,res,next) {
  if (req.user.level === "admin") next();
  else res.status(401).jsonp({error: "Não autorizado"})
}, function(req, res){

  axios.put("http://localhost:8002/users/" + req.params.uname + "?level=consumidor")
    .then(dados => res.status(200).jsonp(dados.data))
    .catch(e => res.status(501).jsonp({error: e}))
})


module.exports = router;
