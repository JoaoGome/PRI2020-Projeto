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

//Consultar próprio perfil
router.get('/meuPerfil', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/user?token=" + myToken)
    .then(user => res.redirect(`/user/${user.data}`))
    .catch(e => res.render('error', {error:e}))
})


//Consultar um user
router.get('/:id', function(req, res){
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "?token=" + myToken)
    .then(dados =>{
      var nivel = dados.data.nivel
      var username = dados.data.username
      var user = dados.data.dados
      var cmts = dados.data.cmts.reverse()
      console.log(dados.data)
      var vis = 4
      if (username === dados.data.dados.username) vis = 3
      else if (nivel === "admin") vis = 1
      
      res.render('utilizador', {tab:req.query.tab, vis:vis, user:user, username:username, utilizador:req.params.id, comentarios:cmts})
    })
    .catch(e => res.render('error', {error:e}))

})

//Consultar os recursos de um user
router.get('/:id/recursos', function(req, res){
  var myToken = req.cookies.token;
  var sort = "titulo,titulo"
  if(req.query.sortBy) sort = req.query.sortBy
  var order = "asc,asc"
  if(req.query.orderBy) order = req.query.orderBy
  var filter = ""
  if(req.query.filterBy) filter =  req.query.filterBy
  var filterVis = "todos"
  if(req.query.visBy) filterVis = req.query.visBy
  var visBy = ""
  if (req.query.visBy) visBy = `&visBy=${req.query.visBy}`

  axios.get("http://localhost:8000/recursos/user/" + req.params.id + "?sortBy="+sort+"&orderBy="+order+"&filterBy="+filter+visBy + "&token=" + myToken)
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

      res.render('utilizador', {tab:req.query.tab, tipos:tipos, vis:vis, user:user, username:user.username, utilizador:req.params.id, recursos:recs, sort:sort,order:order,filter:filter,filterVis:filterVis})
    })
    .catch(e => res.render('error', {error:e}))
})



//Eliminar um user
router.get('/:id/remover', function(req,res) {
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

//consumidor -> produtor
router.get('/:id/upgrade', function(req,res) {
  var myToken = req.cookies.token;
  axios.put("http://localhost:8000/users/" + req.params.id + "/upgrade?token=" + myToken)
    .then(d => res.redirect('/mainPage?tab=users'))
    .catch(e => res.render('error', {error:e}))
})

//produtor -> consumidor
router.get('/:id/downgrade', function(req,res) {
  var myToken = req.cookies.token;
  axios.put("http://localhost:8000/users/" + req.params.id + "/downgrade?token=" + myToken)
    .then(d => res.redirect('/mainPage?tab=prods'))
    .catch(e => res.render('error', {error:e}))
})

// Eliminar os comentarios de um user
router.get('/:user/remover/comentarios', function(req,res) {
  var myToken = req.cookies.token
  axios.delete('http://localhost:8000/comentarios/user/' + req.params.user +'?token=' + myToken)
    .then(dados =>{ 
      if (req.query.eliminado)
        res.redirect('/mainPage')
      else
        res.redirect(`/user/${req.params.user}`)})
    .catch(e => res.render('error', {error:e}))
})






module.exports = router;
