var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
const path = require('path');

var fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads/'})
const StreamZip = require('node-stream-zip');

router.get('/upload', function(req,res) {
  res.render('upload')
})

// consultar recurso
router.get('/:id', function(req, res, next) {
  var myToken = req.cookies.token;
  var tab = 1
  if (req.query.tab) tab = 2
  axios.get('http://localhost:8000/comentarios/recurso/' + req.params.id + '?token=' + myToken)
    .then(c =>{
      var nivel = c.data.nivel
      var user = c.data.user
      var cmt = c.data.dados
      axios.get('http://localhost:8000/recurso/pessoal/' + req.params.id + '?token=' + myToken)
        .then(dados =>{ 
          if(dados.data == null)
            axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
              .then(d =>res.render('recurso', {tab:tab, nivel:nivel, user:user, recurso: d.data, comentarios: cmt.reverse()}))
              .catch(e => res.render('error', {error:e}))       
          else
            res.render('recurso', {tab:tab, eliminar:"sim", nivel:nivel, user:user, recurso: dados.data, comentarios: cmt.reverse()})})
        .catch(e => 
          axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
              .then(d => res.render('recurso', {tab:tab, nivel:nivel, user:user, recurso: d.data, comentarios: cmt.reverse()}))
              .catch(e => res.render('error', {error:e}))
      )}
    )
    .catch(e => res.render('error', {error:e}))
  
});

//consultar recurso pessoal
router.get('/meu/:id', function(req, res, next) {
  res.redirect(`/recurso/${req.params.id}?tab=2`)
});


//--------------------------------------- Recurso BD--------------------------------------------


// Eliminar um recurso
router.get('/:id/remover', function(req,res) {
  var myToken = req.cookies.token;
  var tab = 1
  if (req.query.tab) tab = req.query.tab
  axios.delete('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
    .then(dados => res.redirect(`/mainPage?tab=${tab}`))
    .catch(e => res.render('error', {error:e}))
})


// Editar um recurso
router.get('/:id/editar', function(req,res) {
  var myToken = req.cookies.token;
  axios.get('http://localhost:8000/recurso/pessoal/' + req.params.id + '?token=' + myToken)
    .then(dados =>{
      var hashtags = dados.data.hashtags[0]
      for(var i = 1; i < dados.data.hashtags.length; i++)
        hashtags += " " + dados.data.hashtags[i]
      res.render('recurso-edit', {recurso: dados.data, hashtags: hashtags})
    })
    .catch(e => res.render('error', {error:e}))
})


// Alterar um recurso
router.post('/', function(req,res){
  var myToken = req.cookies.token;
  newString = req.body.hashtags.replace(/\s+/g,' ').trim();
  req.body.hashtags = newString.split(" ")
  axios.put('http://localhost:8000/recurso?token=' + myToken, req.body)
    .then(dados => res.redirect('/mainPage?tab=2'))
    .catch(e => res.render('error', {error:e})) 
})


//--------------------------------------- Comment Section--------------------------------------------


// Adicionar comentário
router.post('/:id/comentario', function(req,res) {
  var myToken = req.cookies.token;
  axios.post('http://localhost:8000/comentarios/recurso/' + req.params.id + '?token=' + myToken, req.body)
    .then(dados => res.redirect(`/recurso/${req.params.id}`))
    .catch(e => res.render('error', {error:e}))
})

// Eliminar um comentario de um recurso
router.get('/remover/:c', function(req,res) {
  var myToken = req.cookies.token
  axios.delete('http://localhost:8000/comentarios/' + req.params.c + '?token=' + myToken)
    .then(dados => res.redirect(`/recurso/${req.params.rec}`))
    .catch(e => res.render('error', {error:e}))
})


// Eliminar os comentarios de um recurso
router.get('/:rec/remover/comentarios', function(req,res) {
  var myToken = req.cookies.token
  axios.get('http://localhost:8000/recurso/' + req.params.rec + '?token=' + myToken)
    .then(
      axios.delete('http://localhost:8000/comentarios/recurso/' + req.params.rec +'/owner/' + req.params.owner + '?token=' + myToken)
        .then(dados =>{ 
          if (req.query.eliminado)
            res.redirect('/mainPage')
          else
            res.redirect(`/recurso/${req.params.rec}`)})
        .catch(e => res.render('error', {error:e}))
    )
    .catch(e => res.render('error', {error:e}))
})





//Files upload section


function existe (a,b) {
  for (i = 0; i < b.length; i++)
    if (b[i] == a) return true
  return false
}



router.post('/upload', upload.single('myFile'), function(req, res, next){
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
                res.redirect('/mainPage?tab=2')
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
