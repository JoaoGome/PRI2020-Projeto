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
  {
    if (b[i] == a) return true
  }

  return false
}

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

router.get('/mainPage', function(req,res) {
    res.render('mainPage')
})

router.get('/files/upload', function(req,res) {
  res.render('upload')
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

    else 
    {
      good = 0;
    }

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

            axios.post('http://localhost:8000/recursos?token=' + req.cookies.token,req.body)
              .then(dados => {
                res.render('mainPage')
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
