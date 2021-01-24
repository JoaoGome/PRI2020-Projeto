var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
const path = require('path');

var fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})
const StreamZip = require('node-stream-zip');

// funçoes auxiliares

function existe (a,b) 
{
  for (i = 0; i < b.length; i++)
    if (b[i] == a) return true
  return false
}

// GETS

//Consultar um user
router.get('/:id', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "?token=" + myToken)
    .then(dados =>{ 
      var nivel = dados.data.nivel
      var username = dados.data.username
      axios.get("http://localhost:8000/users/" + req.params.id + "/comentarios?token=" + myToken)
        .then(cmts =>{ 
          if (cmts) cmts = cmts.data.reverse()
          res.render('utilizador', {nivel: nivel, username: username, user: dados.data.dados, comentarios: cmts})})
        .catch(e => res.render('error', {error:e}))
    })
    .catch(e => res.render('error', {error:e}))
})


//Eliminar um user
router.get('/:id/remover', function(req,res) {
    var myToken = req.cookies.token
    var tab = 1
    var tab2 = 1
    if (req.query.tab) tab = req.query.tab
    if (req.query.tab2) tab2 = req.query.tab2
    axios.get("http://localhost:8000/users/" + req.params.id + "/remover?token=" + myToken)
      .then(d => res.redirect(`/mainPage?tab=${tab}&tab2=${tab2}`))
      .catch(e => res.render('error', {error:e}))
})

//consumidor -> produtor
router.get('/:id/upgrade', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "/upgrade?token=" + myToken)
    .then(d => res.redirect('/mainPage?tab=3'))
    .catch(e => res.render('error', {error:e}))
})

//produtor -> consumidor
router.get('/:id/downgrade', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "/downgrade?token=" + myToken)
    .then(d => res.redirect('/mainPage?tab=3&tab2=2'))
    .catch(e => res.render('error', {error:e}))
})








module.exports = router;
