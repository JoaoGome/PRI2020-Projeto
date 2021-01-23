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
router.get('/', function(req, res, next) {
    res.render('index');
});



router.get('/mainPage', function(req,res) {
  var myToken = req.cookies.token;
  var tab = 1
  if(req.query.tab) tab = req.query.tab
  //Pedir lista de recursos
  axios.get("http://localhost:8000/recursos?token=" + myToken)
    .then(r =>{

        //Pedir recursos pessoais
        axios.get("http://localhost:8000/recursos/produtor?token=" + myToken)
          .then(p => {

            //Pedir lista de produtores
            axios.get("http://localhost:8000/users?level=produtor&token=" + myToken)
              .then(ps => {
                
                axios.get("http://localhost:8000/users?level=consumidor&token=" + myToken)
                  .then(cs => {

                    console.log("admin")
                    res.render('mainPage', {recursos: r.data, produtores: ps.data, consumidores:cs.data, pessoais: p.data})
                  
                  })
                  .catch(e => res.render('mainPage', {recursos: r.data, pessoais: p.data}))
                  
              })
              .catch(e =>{
                console.log("produtor")
                res.render('mainPage', {recursos: r.data, pessoais: p.data})
              })

          })
          .catch(e => {
            console.log("consumidor")
            res.render('mainPage', {recursos: r.data})
          })

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
        expires: new Date(Date.now() + '1d'),
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



//Files upload section

router.get('/files/upload', function(req,res) {
  res.render('upload')
})

router.post('/files/upload', upload.single('myFile'), function(req, res, next){
  var myToken = req.cookies.token;
  jwt.verify(myToken, 'PRI2020', function(e, payload){
    if(e) res.status(401).jsonp({error: 'Erro na verificação do token: ' + e})
    else{
      req.user = { level: payload.level, username: payload.username }
      next()
    } 
  })
}, function(req,res){
  good = 1
  listaFicheiros = []

  const zip = new StreamZip({
    file:req.file.path,
    storeEntries: true
  })

  zip.on('ready', () => {
    // Take a look at the files
    
    for (const entry of Object.values(zip.entries())) {
      //zipDotTxtContents = zip.entryDataSync(entry).toString('utf8');
      listaFicheiros.push(entry.name)
    }
    if (existe("manifesto.txt",listaFicheiros))
    {
      data = zip.entryDataSync("manifesto.txt").toString('utf8');
      partida = data.split(" ")
      
      for (i in partida)
      {
        if (existe(partida[i],listaFicheiros) == false) good = 0;
      }
    }

    else good = 0;

    zip.close()
  });
  

  if (good == 1)
  {
      //zip valido
      var parentDir = path.normalize(__dirname+"/..");
      let quarantinePath = parentDir + '/' + req.file.path
      let newPath = parentDir + '/public/fileStore/' + req.file.originalname

      fs.rename(quarantinePath, newPath, function(err){
        if(err){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<p> Erro: ao mover o ficheiro da quarentena: ' + err + '</p>')
            res.end()
        }
        else{
            req.body.dataRegisto = new Date().toISOString().slice(0, 10)
            req.body.id = req.file.originalname
            req.body.fileName = req.file.orignalName
            req.body.autor = req.user.username
            newString = req.body.hashtags.replace(/\s+/g,' ').trim();
            req.body.hashtags = newString.split(" ")

            axios.post('http://localhost:8000/recurso?token=' + req.cookies.token,req.body)
              .then(dados => {
                res.render('/mainPage?tab=3')
              })
              .catch(e => res.render('error', {error: e}))
            

            
        }
    })
  } 
  else 
  {
    // zip invalido  
  }
})





module.exports = router;
