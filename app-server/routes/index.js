var express = require('express');
var router = express.Router();
var axios = require('axios')

// GETS
router.get('/', function(req, res, next) {
    res.render('pagina-inicial');
});

router.get('/login', function(req,res) {
    res.render('login-form')
});

router.get('/register', function(req,res) {
    res.render('register-form')
})

router.get('/MainPage', function(req,res) {
    res.render('dummy', {token: req.cookies.token})
})

//POSTS
router.post('/login', function(req, res) {
  axios.post('http://localhost:8002/users/login', req.body)
    .then(dados => {
      res.cookie('token', dados.data.token, {
        expires: new Date(Date.now() + '1d'),
        secure: false, // set to true if your using https
        httpOnly: true
      });
      res.redirect('/MainPage')
    })
    .catch(e => res.render('error', {error: e}))
});

router.post('/register', function(req,res) {
  axios.post('http://localhost:8002/users/registar', req.body)
    .then(res.redirect('/'))
    .catch(e => res.render('error', {error:e}))
})



module.exports = router;
