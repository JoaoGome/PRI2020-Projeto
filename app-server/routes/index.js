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


// GETS
router.get('/', function(req, res, next) {
    res.render('index');
});



router.get('/mainPage', function(req,res) {
  var myToken = req.cookies.token;

  //abrir na tab correta
  var tab = 1
  var tab31 = "block"
  var tab32 = "none"

  //Pedir lista de recursos
  axios.get("http://localhost:8000/recursos?token=" + myToken)
    .then(r  =>{
        var nivel = r.data.level
        var dados = r.data.dados

        // pedir lista de tipos
        axios.get("http://localhost:8000/recursos/tipos?token=" + myToken)
          .then(tipos =>{

            if (nivel === "consumidor")
              res.render('mainPage', {nivel:nivel, tab:tab,tab31:tab31,tab32:tab32, tipos:tipos.data, recursos:dados})

            else
              //abrir na tab correta
              if(req.query.tab && req.query.tab != 3) tab = req.query.tab
          
              //Pedir recursos pessoais
              axios.get("http://localhost:8000/recursos/pessoais?token=" + myToken)
                .then(p => {

                  if (nivel === "admin"){

                    //abrir na tab correta
                    if(req.query.tab) tab = req.query.tab
                    if(req.query.tab2 && req.query.tab2 == 2){
                      tab31 = "none"
                      tab32 = "display"
                    }

                    //Pedir lista de produtores
                    axios.get("http://localhost:8000/users?level=produtor&token=" + myToken)
                    .then(ps => {
                    
                      //Pedir lista de consumidores
                      axios.get("http://localhost:8000/users?level=consumidor&token=" + myToken)
                        .then(cs => {

                          res.render('mainPage', {nivel:nivel, tab:tab,tab31:tab31,tab32:tab32, tipos:tipos.data, recursos:dados, produtores:ps.data, consumidores:cs.data, pessoais:p.data})
                        
                        })
                        .catch(e => res.render('error', {error:e}))
                      
                    })
                    .catch(e => res.render('error', {error:e}))
                  }
                  else
                    res.render('mainPage', {nivel:nivel, tab:tab,tab31:tab31,tab32:tab32, tipos:tipos.data, recursos:dados, pessoais:p.data})
                })
                .catch(e => res.render('error', {error:e}))
            })
            .catch(e => res.render('error', {error:e}))
    })
    .catch(e => res.render('error', {error:e}))
});




// listar recursos determinada hashtag
router.get('/recursos', function(req,res) {
  var myToken = req.cookies.token;
  if(req.query.hashtag)
    axios.get('http://localhost:8000/recursos?hashtag=' + req.query.hashtag + '&token=' + myToken)
      .then(dados => res.render('hashtag', {hashtag: req.query.hashtag, recursos: dados.data}))
      .catch(e => res.render('error', {error:e}))
  else 
    res.redirect('/mainPage')
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
