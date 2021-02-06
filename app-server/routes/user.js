var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
const path = require('path');

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


// GETS


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


//Consultar próprio perfil
router.get('/meuPerfil', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/meuPerfil?token=" + myToken)
    .then(dados =>{
      var nivel = dados.data.nivel
      var username = dados.data.username
      var user = dados.data.dados
      var cmts = dados.data.cmts.reverse()

      var r = -1
      if (req.query.r) r = Number(req.query.r)
      var vis = 4
      if (username === dados.data.dados.username) vis = 3
      else if (nivel === "admin") vis = 1
      
      res.render('utilizador', {tab:req.query.tab, vis:vis, user:user, username:username, utilizador:username, comentarios:cmts, r:r})
    })
    .catch(e => res.render('error', {error:e}))

})


//Consultar um user
router.get('/:id', verificaAutenticacao, function(req, res){
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "?token=" + myToken)
    .then(dados =>{
      var nivel = dados.data.nivel
      var username = dados.data.username
      var user = dados.data.dados
      var cmts = dados.data.cmts.reverse()

      var r = -1
      if (req.query.r) r = Number(req.query.r)
      var vis = 4
      if (username === dados.data.dados.username) vis = 3
      else if (nivel === "admin") vis = 1
      
      res.render('utilizador', {tab:req.query.tab, vis:vis, user:user, username:username, utilizador:req.params.id, comentarios:cmts, r:r})
    })
    .catch(e => res.render('error', {error:e}))

})

//Consultar os recursos de um user
router.get('/:id/recursos', verificaAutenticacao, function(req, res){
  var myToken = req.cookies.token;
  
  //filtros
  var filtros = defineFiltros(req, "")
  var sort = filtros[0], order = filtros[1], filter = filtros[2], filterVis = filtros[3], filterBy = filtros[4], visBy = filtros[5], classificar = filtros[6], classificarBy = filtros[7], r = filtros[8]

  axios.get("http://localhost:8000/recursos/user/" + req.params.id + "?sortBy="+sort+"&orderBy="+order+filterBy+visBy+classificarBy + "&token=" + myToken)
    .then(dados =>{
      var tipos = dados.data.tipos
      var recs = dados.data.dados
      var nivel = dados.data.nivel 
      var user = dados.data
      var vis = 4
      if (req.params.id === user.username) vis = 3
      else if (nivel === "admin") vis = 1
      sort = sort.split(',')
      order = order.split(',')
      filter = filter.split(',')

      res.render('utilizador', {tab:req.query.tab, tipos:tipos, vis:vis, user:user, username:user.username, utilizador:req.params.id, recursos:recs, sort:sort,order:order,filter:filter,filterVis:filterVis,classificar:classificar, r:r})
    })
    .catch(e => res.render('error', {error:e}))
})



//Eliminar um user
router.get('/:id/remover', verificaAutenticacao, function(req,res) {
    var myToken = req.cookies.token
    var tab = "users"
    if (req.query.tab) tab = req.query.tab
    axios.delete("http://localhost:8000/users/" + req.params.id + "?token=" + myToken)
      .then(d =>{
        // fazer logout do user com id
        if (req.query.conta){
          res.redirect('/')
        }
        else
          res.redirect(`/mainPage?tab=users`)
      })
      .catch(e => res.render('error', {error:e}))
})

//alterar pedido do utilizador
router.get('/:id/alterar', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  var r = -2
  if (req.query.r) r = Number(req.query.r) -1
  axios.put("http://localhost:8002/users/" + req.params.id + "?pedido=" + req.query.pedido + "&token=" + myToken)
    .then(d => res.redirect(`/user/meuPerfil?r=${r}`))
    .catch(e => res.render('error', {error:e}))
})

//consumidor -> produtor
router.get('/:id/upgrade', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  axios.put("http://localhost:8002/users/" + req.params.id + "?level=produtor&pedido=nao&token=" + myToken)
    .then(d => res.redirect('/mainPage?tab=users'))
    .catch(e => res.render('error', {error:e}))
})

//produtor -> consumidor
router.get('/:id/downgrade', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  axios.put("http://localhost:8002/users/" + req.params.id + "?level=consumidor&token=" + myToken)
    .then(d => res.redirect('/mainPage?tab=prods'))
    .catch(e => res.render('error', {error:e}))
})

// Eliminar os comentarios de um user
router.get('/:user/remover/comentarios', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token
  axios.delete('http://localhost:8000/comentarios/user/' + req.params.user +'?token=' + myToken)
    .then(dados =>{ 
      var r = -2
      if(req.query.r) r = Number(req.query.r) - 1

      if (req.query.eliminado)
        res.redirect('/mainPage')
      else
        res.redirect(`/user/${req.params.user}?r=${r}`)})
    .catch(e => res.render('error', {error:e}))
})






module.exports = router;
