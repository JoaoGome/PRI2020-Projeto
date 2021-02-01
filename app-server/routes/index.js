var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
const path = require('path');

var fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})
const StreamZip = require('node-stream-zip');



// GETS
router.get('/', function(req, res, next) {
    res.render('index');
});



router.get('/mainPage', function(req,res) {
  var myToken = req.cookies.token;

  //abrir na tab correta
  var tab = "main"
  if(req.query.tab) tab = req.query.tab

  var order = "titulo"
  if(tab === "users" || tab === "prods") order = "username"
  if(req.query.sortBy) order = req.query.sortBy

  if(tab === "main"){
    //Pedir lista de recursos
    axios.get("http://localhost:8000/recursos?sortBy=" + order + "&token=" + myToken)
      .then(r  =>{
          var dados = r.data.dados
          var tipos = r.data.tipos
          var nivel = r.data.level
          var vis = 4
          if(nivel === "admin") vis = 1
          
          if(order === "owner") order = "produtor"
          res.render('main_recs', {nivel:nivel, produtor:"sim", vis:vis, tab:tab, tipos:tipos, recursos:dados, sort:order})
      })
      .catch(e => res.render('error', {error:e}))
  }
  if(tab === "meus"){
    //Pedir lista de recursos pessoais
    axios.get("http://localhost:8000/recursos/pessoais?sortBy=" + order + "&token=" + myToken)
      .then(r  =>{
          var nivel = r.data.level
          var dados = r.data.dados
          var tipos = r.data.tipos
          var vis = 2
          if(order === "owner") order = "produtor"
          res.render('main_meus', {nivel:nivel, vis:vis, tab:tab, tipos:tipos, recursos:dados, sort:order})
      })
      .catch(e => res.render('error', {error:e}))
  }
  if(tab === "users" || tab === "prods"){
    var tab31 = "block"
    var tab32 = "block"
    if(tab === "users") tab32 = "none"
    if(tab === "prods") tab31 = "none"

    //Pedir lista de produtores
    axios.get("http://localhost:8000/users?level=consumidor&sortBy=" + req.query.sortBy + "&token=" + myToken)
      .then(cs =>{
        var nivel = cs.data.nivel
        var cons = cs.data.dados
        //Pedir lista de produtores
        axios.get("http://localhost:8000/users?level=produtor&sortBy=" + req.query.sortBy + "&token=" + myToken)
          .then(ps =>{
            if(order === "dataLastAcess") order = "ultimoAcesso"
            res.render('main_users', {nivel:nivel, tab:tab,tab31:tab31,tab32:tab32, produtores:ps.data.dados, consumidores:cons, sort:order})
          }).catch(e => res.render('error', {error:e}))    
      })
      .catch(e => res.render('error', {error:e}))  
  }
/*  if(tab === "users"){
    //Pedir lista de produtores
    axios.get("http://localhost:8000/users?level=consumidor&token=" + myToken)
      .then(cs => res.render('tab3', {nivel:nivel, consumidores:cs.data, sort:order}))
      .catch(e => res.render('error', {error:e}))    
  }
  if(tab === "prod"){
    //Pedir lista de produtores
    axios.get("http://localhost:8000/users?level=produtor&token=" + myToken)
      .then(ps => res.render('tab3', {nivel:nivel, produtores:ps.data, sort:order}))
      .catch(e => res.render('error', {error:e}))                    
  }*/
});




// listar recursos determinada hashtag
router.get('/recursos', function(req,res) {
  var myToken = req.cookies.token;
  if(req.query.hashtag){
    var order = "titulo"
    if(req.query.sortBy) order = req.query.sortBy
    axios.get('http://localhost:8000/recursos?hashtag=' + req.query.hashtag + '&sortBy=' + order + '&token=' + myToken)
      .then(dados => res.render('hashtag', {produtor:"sim", tipos:dados.data.tipos, hashtag: req.query.hashtag, recursos: dados.data.dados, sort:order}))
      .catch(e => res.render('error', {error:e}))
  }
  else 
    res.redirect('/mainPage')
})

// procurar recursos com determinado texto
router.get('/recursos/procurar', function(req,res) {
  var myToken = req.cookies.token;
  var order = "titulo"
  if(req.query.sortBy) order = req.query.sortBy
  if(req.query.titulo){
    var ht = req.query.titulo.replace(/\s*/g,'');
    axios.get("http://localhost:8000/recursos?procurar=" + req.query.titulo + '&sortBy=' + order + "&token=" + myToken)
      .then(recTitulo => res.render('procurar', {tab:"titulo", produtor:"sim", sort:order, procura:req.query.titulo, ht:ht, tipos:recTitulo.data.tipos, recursos:recTitulo.data.dados}))
      .catch(e => res.render('error', {error:e}))
  }
  if(req.query.hashtag){
    var ht = req.query.hashtag
    axios.get('http://localhost:8000/recursos?hashtag=' + ht + '&sortBy=' + order + '&token=' + myToken)
      .then(recHashtag => res.render('procurar', {tab:"hashtag", produtor:"sim", sort:order, procura:ht, tipos:recHashtag.data.tipos, recursos:recHashtag.data.dados}))
      .catch(e => res.render('error', {error:e}))
  }
})

// procurar recursos com determinado texto
router.post('/recursos/procurar', function(req,res) {
  res.redirect(`/recursos/procurar?titulo=${req.body.search}`)
})




// Eliminar um comentario 
router.get('/comentario/remover/:c', function(req,res) {
  var myToken = req.cookies.token
  axios.delete('http://localhost:8000/comentarios/' + req.params.c + '?token=' + myToken)
    .then(dados =>{
      if (req.query.user) res.redirect(`/user/${req.query.user}`)
      if (req.query.recurso) res.redirect(`/recurso/${req.query.recurso}`)
    })
    .catch(e => res.render('error', {error:e}))
})



// Login and Register

router.get('/login', function(req,res) {
  res.render('login-form', {user: ""})
});

router.get('/register', function(req,res) {
  res.render('register-form', {user: "", email: "", fil: ""})
})

router.post('/login', function(req, res) {
  axios.post('http://localhost:8002/users/login', req.body)
    .then(dados => {
      res.cookie('token', dados.data.token, {
        maxAge : new Date(Date.now() + 3600000),
        secure: false, // set to true if your using https
        httpOnly: true
      });
      res.redirect('/mainPage')
    })
    .catch(e => res.render('login-form', {erro: e, user: req.body.username}))
});

router.post('/register', function(req,res) {
  axios.post('http://localhost:8002/users/registar', req.body)
    .then(dados => res.redirect('/'))
    .catch(e => res.render('register-form', {error:e, user: req.body.username, email: req.body.email, fil: req.body.filiacao}))
})






module.exports = router;
