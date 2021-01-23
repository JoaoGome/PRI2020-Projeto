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
  axios.get('http://localhost:8000/recurso/' + req.params.id + '/comentarios?token=' + myToken)
    .then(c =>
      axios.get('http://localhost:8000/recurso/produtor/' + req.params.id + '?token=' + myToken)
      .then(dados =>{ 
        if(dados.data == null)
          axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
            .then(d => res.render('recurso', {recurso: d.data, comentarios: c.data}))
            .catch(e => res.render('error', {error:e}))
        else
          res.render('recurso', {eliminar:"sim", recurso: dados.data, comentarios: c.data})})
      .catch(e => 
        axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
            .then(d => res.render('recurso', {recurso: d.data, comentarios: c.data}))
            .catch(e => res.render('error', {error:e}))
      )
    )
    .catch(e => res.render('error', {error:e}))
  
});

//consultar recurso pessoal                                                           ---------------> eliminar?
router.get('/meu/:id', function(req, res, next) {
  var myToken = req.cookies.token;
  axios.get('http://localhost:8000/recurso/produtor/' + req.params.id + '?token=' + myToken)
    .then(dados => res.render('recurso', {eliminar:"sim", recurso: dados.data}))
    .catch(e => res.render('error', {error:e}))
});


// Adicionar comentário
router.post('/:id/comentario', function(req,res) {
  var myToken = req.cookies.token;
  axios.post('http://localhost:8000/recurso/' + req.params.id + '/comentario?token=' + myToken, req.body)
    .then(dados => res.redirect('/mainPage'))
    .catch(e => res.render('error', {error:e}))
})


// Eliminar um recurso
router.get('/:id/remover', function(req,res) {
  var myToken = req.cookies.token;
  axios.delete('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
    .then(dados => res.redirect('/mainPage'))
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
    .then(dados => res.redirect('/mainPage'))
    .catch(e => res.render('error', {error:e})) 
})


module.exports = router;
