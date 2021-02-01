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
      var vis = 4
      if (username === dados.data.dados.username) vis = 3
      else if (nivel === "admin") vis = 1
      
      res.render('utilizador', {tab:req.query.tab, vis:vis, user:user, utilizador:req.params.id, comentarios:cmts})
    })
    .catch(e => res.render('error', {error:e}))

})

//Consultar os recursos de um user
router.get('/:id/recursos', function(req, res){
  var myToken = req.cookies.token;
  var order = "titulo"
  if(req.query.sortBy) order = req.query.sortBy
  axios.get("http://localhost:8000/recursos/user/" + req.params.id + "?sortBy=" + order + "&token=" + myToken)
    .then(dados =>{
      var tipos = dados.data.tipos
      var recs = dados.data.dados
      var nivel = dados.data.nivel 
      var user = dados.data
      var vis = 4
      if (req.params.id === user.username) vis = 3
      else if (nivel === "admin") vis = 1

      res.render('utilizador', {tab:req.query.tab, tipos:tipos, vis:vis, user:user, utilizador:req.params.id, recursos:recs, sort:order})
    })
    .catch(e => res.render('error', {error:e}))
})


/*router.get('/:id', function(req,res) {
  var myToken = req.cookies.token;
  axios.get("http://localhost:8000/users/" + req.params.id + "?token=" + myToken)
    .then(dados =>{ 
      var nivel = dados.data.nivel
      var username = dados.data.username
      var vis = 4
      if (username === dados.data.dados.username)
        if(nivel === "produtor") vis = 2
        else vis = 3
      else if (nivel === "admin") vis = 1
      var order = "titulo"
      if(req.query.sortBy) order = req.query.sortBy

      axios.get("http://localhost:8000/recursos/tipos?token=" + myToken)
        .then(tipos =>
          axios.get("http://localhost:8000/comentarios/user/" + req.params.id + "?token=" + myToken)
            .then(cmts =>{ 
              if (cmts) cmts = cmts.data.reverse()
              var tab = "tab1"
              if(req.query.tab === "recs") tab = "tab2"
              axios.get("http://localhost:8000/recursos/user/" + req.params.id + "?token=" + myToken)
                .then(ps =>{res.render('utilizador', {tab:tab, tipos:tipos.data, vis:vis, nivel:nivel, username: username, user: dados.data.dados, comentarios: cmts, recursos: ps.data, sort:order})})
                .catch(e => res.render('error', {error:e}))
            })
            .catch(e => res.render('error', {error:e}))
        ).catch(e => res.render('error', {error:e}))
    })
    .catch(e => res.render('error', {error:e}))
})*/



//Eliminar um user
router.get('/:id/remover', function(req,res) {
    var myToken = req.cookies.token
    var tab = "users"
    if (req.query.tab) tab = req.query.tab
    axios.delete("http://localhost:8000/users/" + req.params.id + "?token=" + myToken)
      .then(d => {
        window.history.go(-1)})
        //res.redirect(`/mainPage?tab=${tab}`))
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
