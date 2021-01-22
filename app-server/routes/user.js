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

router.get('/:id/remover', function(req,res) {
    var myToken = req.cookies.token;
    axios.get("http://localhost:8000/users/" + req.params.id + "/remover?token=" + myToken)
      .then(d => res.redirect('/mainPage'))
      .catch(e => res.render('error', {error:e}))
})

router.get('/:id/upgrade', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "/upgrade?token=" + myToken)
    .then(d => res.redirect('/mainPage'))
    .catch(e => res.render('error', {error:e}))
})

router.get('/:id/downgrade', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "/downgrade?token=" + myToken)
    .then(d => res.redirect('/mainPage'))
    .catch(e => res.render('error', {error:e}))
})








module.exports = router;
