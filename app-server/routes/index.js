var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
const path = require('path');
var passport = require('passport')

var fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})
const StreamZip = require('node-stream-zip');

// usar para proteger as rotas.
function verificaAutenticacao(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else{
  res.redirect('/');}
}

//usar apenas na pagina inicial para caso o user ainda esteja logged in ir diretamente para a MainPage
function verificaInicial (req,res,next) {
  if(req.isAuthenticated()){
    res.redirect('/mainPage')
  } else{
    next();}
}

function defineFiltros(req, tab){

  //filtros
  var sort = "titulo,titulo"
  if(tab === "users" || tab === "prods") sort = "username"
  if(req.query.sortBy) sort = req.query.sortBy
  
  var order = "asc,asc"
  if(req.query.orderBy) order = req.query.orderBy

  var filter = ""
  if(req.query.filterBy) filter =  req.query.filterBy

  var filterVis = "todos"
  if(req.query.visBy) filterVis = req.query.visBy 
  var visBy = "", filterBy = ""
  if (req.query.visBy) visBy = `&visBy=${req.query.visBy}`
  if (req.query.filterBy) filterBy = `&filterBy=${filter}`

  var classificar = -1
  if(req.query.classificarBy) classificar = Number(req.query.classificarBy)
  var classificarBy = ""
  if(req.query.classificarBy) classificarBy = `&classificarBy=${req.query.classificarBy}`

  var r = -1
  if (req.query.r) r = Number(req.query.r)

  return [sort, order, filter, filterVis, filterBy, visBy, classificar, classificarBy, r]
}


// GETS
router.get('/', verificaInicial,function(req, res, next) {
  res.render('index');
});



router.get('/mainPage', verificaAutenticacao,function(req,res) {
  var myToken = req.cookies.token;

  //abrir na tab correta
  var tab = "main"
  if(req.query.tab) tab = req.query.tab

  //filtros
  var filtros = defineFiltros(req, tab)
  var sort = filtros[0], order = filtros[1], filter = filtros[2], filterVis = filtros[3], filterBy = filtros[4], visBy = filtros[5], classificar = filtros[6], classificarBy = filtros[7]

  if(tab === "main"){
    //Pedir lista de recursos
    axios.get("http://localhost:8000/recursos?sortBy="+sort+"&orderBy="+order+filterBy+visBy+classificarBy  + "&token=" + myToken)
      .then(r  =>{
          var dados = r.data.dados
          var tipos = r.data.tipos
          var nivel = r.data.level
          var vis = 4
          if(nivel === "admin") vis = 1

          sort = sort.replace(/owner/,"produtor").split(',')
          order = order.split(',')
          filter = filter.split(',')

          res.render('main_recs', {nivel:nivel, produtor:"sim", vis:vis, tab:tab, tipos:tipos, recursos:dados, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar,r:""})
      })
      .catch(e => res.render('error', {error:e}))
  }
  if(tab === "meus"){
    //Pedir lista de recursos pessoais
    axios.get("http://localhost:8000/recursos/pessoais?sortBy="+sort+"&orderBy="+order+filterBy+visBy+classificarBy + "&token=" + myToken)
      .then(r  =>{
          var nivel = r.data.level
          var dados = r.data.dados
          var tipos = r.data.tipos
          var vis = 2
          sort = sort.replace(/owner/,"produtor").split(',')
          order = order.split(',')
          filter = filter.split(',')
          
          res.render('main_meus', {nivel:nivel, vis:vis, tab:tab, tipos:tipos, recursos:dados, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar,r:""})
      })
      .catch(e => res.render('error', {error:e}))
  }
  if(tab === "users" || tab === "prods"){
    var tab31 = "block"
    var tab32 = "block"
    if(tab === "users") tab32 = "none"
    if(tab === "prods") tab31 = "none"

    //Pedir lista de produtores
    axios.get("http://localhost:8002/users?sortBy=" + sort + "&token=" + myToken)
        .then(dados =>{
            var consumidores = dados.data.consumidores
            var produtores = dados.data.produtores

            if(sort === "dataLastAcess") sort = "ultimoAcesso"

            res.render('main_users', {nivel:"admin", tab:tab,tab31:tab31,tab32:tab32, produtores:produtores, consumidores:consumidores, sort:sort})
        })
        .catch(e => res.render('error', {error:e}))  
  }
  if(tab === "news"){
    //Pedir lista de recursos novos
    axios.get("http://localhost:8000/recursos/new?sortBy="+sort+"&orderBy="+order+filterBy+visBy+classificarBy + "&token=" + myToken)
      .then(r  =>{
          var nivel = r.data.level
          var dados = r.data.dados
          var tipos = r.data.tipos
          var info = "info"
          if (r.data.info) info = r.data.info
          var vis = 4
          if(nivel === "admin") vis = 1

          sort = sort.replace(/owner/,"produtor").split(',')
          order = order.split(',')
          filter = filter.split(',')

          res.render('main_news', {news:info, nivel:nivel, vis:vis, tab:tab, tipos:tipos, recursos:dados, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar,r:""})
      })
      .catch(e => res.render('error', {error:e}))
  }
});




// listar recursos determinada hashtag
router.get('/recursos', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  if(req.query.hashtag){
    //filtros
    var filtros = defineFiltros(req, "")
    var sort = filtros[0], order = filtros[1], filter = filtros[2], filterVis = filtros[3], filterBy = filtros[4], visBy = filtros[5], classificar = filtros[6], classificarBy = filtros[7], r = filtros[8]

    axios.get('http://localhost:8000/recursos?hashtag=' + req.query.hashtag + '&sortBy='+sort+"&orderBy="+order+filterBy+visBy+classificarBy + '&token=' + myToken)
      .then(dados =>{
        sort = sort.replace(/owner/,"produtor").split(',')
        order = order.split(',')
        filter = filter.split(',')

        res.render('hashtag', {produtor:"sim", tipos:dados.data.tipos, hashtag: req.query.hashtag, recursos: dados.data.dados, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar,r:r})
      })
      .catch(e => res.render('error', {error:e}))
  }
  else 
    res.redirect('/mainPage')
})

// procurar recursos com determinado texto
router.get('/recursos/procurar', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  
  //filtros
  var filtros = defineFiltros(req, "")
  var sort = filtros[0], order = filtros[1], filter = filtros[2], filterVis = filtros[3], filterBy = filtros[4], visBy = filtros[5], classificar = filtros[6], classificarBy = filtros[7], r = filtros[8]

  if(req.query.titulo){
    var ht = req.query.titulo.replace(/\s*/g,'');
    axios.get("http://localhost:8000/recursos?procurar=" + req.query.titulo + '&sortBy='+sort+"&orderBy="+order+filterBy+visBy+classificarBy + "&token=" + myToken)
      .then(recTitulo =>{
        sort = sort.replace(/owner/,"produtor").split(',')
        order = order.split(',')
        filter = filter.split(',')

        res.render('procurar', {tab:"titulo", produtor:"sim", procura:req.query.titulo, ht:ht, tipos:recTitulo.data.tipos, recursos:recTitulo.data.dados, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar,r:r})
      })
      .catch(e => res.render('error', {error:e}))
  }
  if(req.query.hashtag){
    var ht = req.query.hashtag
    axios.get('http://localhost:8000/recursos?hashtag=' + ht + '&sortBy='+sort+"&orderBy="+order+filterBy+visBy+classificarBy + '&token=' + myToken)
      .then(recHashtag => {
        sort = sort.replace(/owner/,"produtor").split(',')
        order = order.split(',')
        filter = filter.split(',')
      
        res.render('procurar', {tab:"hashtag", produtor:"sim", procura:ht, tipos:recHashtag.data.tipos, recursos:recHashtag.data.dados, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar, r:r})
      })
      .catch(e => res.render('error', {error:e}))
  }
})

// procurar recursos com determinado texto
router.post('/recursos/procurar', verificaAutenticacao, function(req,res) {
  res.redirect(`/recursos/procurar?titulo=${req.body.search}`)
})

// filtrar e ordenar recursos
router.post('/recursos/filtrar', verificaAutenticacao, function(req,res) {
  
  if (Array.isArray(req.body.filterBy)) var tipos = req.body.filterBy.join(',')
  else var tipos = req.body.filterBy
  if (Array.isArray(req.body.ordenar)) var ordenar = req.body.sortBy.join(',')
  else var ordenar = req.body.sortBy
  if (Array.isArray(req.body.ordem)) var ordem = req.body.orderBy.join(',')
  else var ordem = req.body.orderBy
  
  var ref = req.query.ref
  if (!ref.includes('?')) ref += '?'
  else ref += '&'
  if (req.body.filterBy) ref += `filterBy=${tipos}&`
  if (req.body.sortBy) ref += `sortBy=${ordenar}&`
  if (req.body.orderBy) ref += `orderBy=${ordem}&`
  if (req.body.visBy) ref += `visBy=${req.body.visBy}&`
  if (req.body.classificarBy) ref += `classificarBy=${req.body.classificarBy}&`
  ref = ref.slice(0,-1)
  
  var r = -2
  if(req.query.r) r = Number(req.query.r) - 1
  if (req.query.r) ref += "&r=" + r
  
  
  res.redirect(`${ref}`)
})


// Eliminar um comentario 
router.get('/comentario/remover/:c', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token
  axios.delete('http://localhost:8000/comentarios/' + req.params.c + '?token=' + myToken)
    .then(dados =>{
      var r = -2
      if(req.query.r) r = Number(req.query.r) - 1

      if (req.query.user) res.redirect(`/user/${req.query.user}?r=${r}`)
      if (req.query.recurso){
        if(req.query.owner && (dados.data.username === req.query.owner || dados.data.level === "admin"))
          res.redirect(`/recurso/${req.query.recurso}?vis=1&r=${r}`)
        else 
          res.redirect(`/recurso/${req.query.recurso}?vis=2&r=${r}`)
      }
    })
    .catch(e => res.render('error', {error:e}))
})

//logout

router.get('/logout', verificaAutenticacao,function(req,res) {
  req.logout();
  req.session.destroy(function (err) {
    if (!err) {
      console.log("Req.session destroyed!");
      res.redirect('/')
    } else {
      console.log("Destroy session error: " + err)
      res.status(500).jsonp({error: err})
    }
  });
})

// Login and Register

router.get('/login', function(req,res) {
  if (req.query.erro) res.render('login-form', {erro: "erro", user: ""})
  else res.render('login-form', {user: ""})
});

router.get('/register', function(req,res) {
  res.render('register-form', {user: "", email: "", fil: ""})
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login?erro=autenticacao' }),
function(req, res) {
  axios.post('http://localhost:8002/users/login', req.user)
    .then(dados => {
      
      res.cookie('token', dados.data.token, {
        maxAge : new Date(Date.now() + 3600000),
        secure: false, // set to true if your using https
        httpOnly: true
      });
      res.redirect('/mainPage')
    })
    .catch(e => res.render('login-form', {erro: e, user: req.body.username}))
})


router.post('/register', function(req,res) {
  if (req.body.username == "[deleted]")
  {
    res.render('register-form', {error:"erro username", user: req.body.username, email: req.body.email, fil: req.body.filiacao})
  }

  axios.post('http://localhost:8002/users/registar', req.body)
    .then(dados => res.redirect('/'))
    .catch(e => res.render('register-form', {error:e, user: req.body.username, email: req.body.email, fil: req.body.filiacao}))
})






module.exports = router;
