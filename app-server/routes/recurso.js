var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
const path = require('path');

var fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})
const StreamZip = require('node-stream-zip');


// consultar recurso
router.get('/:id', function(req, res, next) {
  var myToken = req.cookies.token;
  var tab = 1
  if (req.query.tab) tab = 2
  axios.get('http://localhost:8000/recurso/' + req.params.id + '/comentarios?token=' + myToken)
    .then(c =>{
      var nivel = c.data.nivel
      var user = c.data.user
      var cmt = c.data.dados
      axios.get('http://localhost:8000/recurso/produtor/' + req.params.id + '?token=' + myToken)
        .then(dados =>{ 
          if(dados.data == null)
            axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
              .then(d => res.render('recurso', {tab:tab, nivel:nivel, user:user, recurso: d.data, comentarios: cmt.reverse()}))
              .catch(e => res.render('error', {error:e}))       
          else
            res.render('recurso', {tab:tab, eliminar:"sim", nivel:nivel, user:user, recurso: dados.data, comentarios: cmt.reverse()})})
        .catch(e => 
          axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
              .then(d => res.render('recurso', {tab:tab, nivel:nivel, user:user, recurso: d.data.reverse, comentarios: cmt.reverse()}))
              .catch(e => res.render('error', {error:e}))
      )}
    )
    .catch(e => res.render('error', {error:e}))
  
});

//consultar recurso pessoal
router.get('/meu/:id', function(req, res, next) {
  res.redirect(`/recurso/${req.params.id}?tab=2`)
});


//--------------------------------------- Recurso BD--------------------------------------------


// Eliminar um recurso
router.get('/:id/remover', function(req,res) {
  var myToken = req.cookies.token;
  var tab = 1
  if (req.query.tab) tab = req.query.tab
  axios.delete('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
    .then(dados => res.redirect(`/mainPage?tab=${tab}`))
    .catch(e => res.render('error', {error:e}))
})


// Editar um recurso
router.get('/:id/editar', function(req,res) {
  var myToken = req.cookies.token;
  axios.get('http://localhost:8000/recurso/produtor/' + req.params.id + '?token=' + myToken)
    .then(dados =>{
      var hashtags = dados.data.hashtags[0]
      for(var i = 1; i < dados.data.hashtags.length; i++)
        hashtags += " " + dados.data.hashtags[i]
      console.log(dados.data)
      res.render('recurso-edit', {recurso: dados.data, hashtags: hashtags})
    })
    .catch(e => res.render('error', {error:e}))
})


// Alterar um recurso
router.post('/', function(req,res){
  var myToken = req.cookies.token;
  newString = req.body.hashtags.replace(/\s+/g,' ').trim();
  req.body.hashtags = newString.split(" ")
  axios.put('http://localhost:8000/recurso?token=' + myToken, req.body)
    .then(dados => res.redirect('/mainPage?tab=2'))
    .catch(e => res.render('error', {error:e})) 
})


//--------------------------------------- Comment Section--------------------------------------------


// Adicionar comentário
router.post('/:id/comentario', function(req,res) {
  var myToken = req.cookies.token;
  axios.post('http://localhost:8000/recurso/' + req.params.id + '/comentario?token=' + myToken, req.body)
    .then(dados => res.redirect(`/recurso/${req.params.id}`))
    .catch(e => res.render('error', {error:e}))
})

// Eliminar um comentario de um recurso
router.get('/:rec/remover/:c', function(req,res) {
  var myToken = req.cookies.token
  axios.delete('http://localhost:8000/recurso/comentario/' + req.params.c +'?owner=' + req.query.owner + '&token=' + myToken)
    .then(dados => res.redirect(`/recurso/${req.params.rec}`))
    .catch(e => res.render('error', {error:e}))
})




module.exports = router;
