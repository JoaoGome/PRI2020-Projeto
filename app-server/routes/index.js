var express = require('express');
var router = express.Router();
var axios = require('axios')

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

router.get('/MainPage', function(req,res) {
    res.render('dummy', {token: req.cookies.token})
})

router.get('/files/upload', function(req,res) {
  res.render(('upload'))
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

router.post('/files/upload', upload.single('myFile'), function(req,res){
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
      let quarantinePath = __dirname + '/' + req.file.path
      let newPath = __dirname + '/public/fileStore/' + req.file.originalname
  } 
  else 
  {
    // zip invalido  
  }
})





module.exports = router;
