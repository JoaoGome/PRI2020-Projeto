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
  axios.get('http://localhost:8000/recurso/produtor/' + req.params.id + '?token=' + myToken)
    .then(dados =>{ 
      if(dados.data == null)
        axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
          .then(d => res.render('recurso', {recurso: d.data}))
          .catch(e => res.render('error', {error:e}))
      else
        res.render('recurso', {eliminar:"sim", recurso: dados.data})})
    .catch(e => res.render('error', {error:e}))
});

//consultar recurso pessoal
router.get('/meu/:id', function(req, res, next) {
  var myToken = req.cookies.token;
  axios.get('http://localhost:8000/recurso/produtor/' + req.params.id + '?token=' + myToken)
    .then(dados => res.render('recurso', {eliminar:"sim", recurso: dados.data}))
    .catch(e => res.render('error', {error:e}))
});




// Eliminar um recurso
router.get('/:id/remover', function(req,res) {
  var myToken = req.cookies.token;
  axios.delete('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
    .then(res.redirect('/mainPage'))
    .catch(e => res.render('error', {error:e}))
})




module.exports = router;
