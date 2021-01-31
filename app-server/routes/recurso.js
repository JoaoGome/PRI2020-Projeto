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
  res.render('upload', {tipo:"", hashtags:"", vis:"3"})
})

// consultar recurso
router.get('/:id', function(req, res, next) {
  var myToken = req.cookies.token;
  var vis = 2
  if(req.query.vis) vis = req.query.vis
  if(vis == 1)
    axios.get('http://localhost:8000/recurso/pessoal/' + req.params.id + '?token=' + myToken)
      .then(dados =>{
        var rec = dados.data.dados
        var nivel = dados.data.level
        var cmt = dados.data.cmts.reverse()
        var user = dados.data.user
        if(dados.data == null) res.render('error', {error:"Não autorizado"})
        else res.render('recurso', {nivel:nivel, user:user, recurso:rec, comentarios: cmt})
      })
      .catch(e => res.render('error', {error:e})) 
      
  if(vis == 2 )
    axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
      .then(dados =>{
        var rec = dados.data.dados
        var nivel = dados.data.level
        var cmt = dados.data.cmts.reverse()
        var user = dados.data.user
        res.render('recurso', {nivel:nivel, user:user, recurso:rec, comentarios: cmt})
      })
      .catch(e => res.render('error', {error:e}))
});




//--------------------------------------- Recurso BD--------------------------------------------


// Eliminar um recurso
router.get('/:id/remover', function(req,res) {
  var myToken = req.cookies.token;
  var tab = 1
  if (req.query.tab) tab = req.query.tab
  axios.get('http://localhost:8000/recurso/' + req.params.id + '/owner?token=' + myToken)
    .then( owner =>{
      console.log(owner.data)
      axios.delete('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
        .then(dados =>
          axios.delete('http://localhost:8000/comentarios/recurso/' + req.params.id +'/owner/' + owner.data.owner + '?token=' + myToken)
            .then(d => res.redirect(`/mainPage?tab=${req.query.tab}`))
            .catch(e => res.render('error', {error:e})))
        .catch(e => res.render('error', {error:e}))
    })
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
router.post('/editar/:id', function(req,res){
  var myToken = req.cookies.token;
  newString = req.body.hashtags.replace(/\s+/g,' ').trim();
  req.body.hashtags = newString.split(" ");
  req.body.tipo = req.body.tipo.toLowerCase();
  axios.put('http://localhost:8000/recurso?token=' + myToken, req.body)
    .then(dados => res.redirect(`/recurso/${req.params.id}`))
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



// Eliminar os comentarios de um recurso
router.get('/:rec/remover/comentarios', function(req,res) {
  var myToken = req.cookies.token
  axios.get('http://localhost:8000/recurso/' + req.params.rec + '/owner?token=' + myToken)
    .then( owner =>{
      axios.delete('http://localhost:8000/comentarios/recurso/' + req.params.rec +'/owner/' + owner.data.owner + '?token=' + myToken)
        .then(dados => res.redirect(`/recurso/${req.params.rec}`))
        .catch(e => res.render('error', {error:e}))
    })
    .catch(e => res.render('error', {error:e}))
})





//Files upload section


function existe (a,b) {
  for (i = 0; i < b.length; i++)
    if (b[i] == a) return true
  return false
}



router.post('/upload', upload.single('myFile'), function(req,res,next) {
  good = 1
  manifestoExiste = 1
  informationExiste = 1
  goodManifesto = 1
  goodInformation = 1
  preview = "nao"
  listaFicheiros = []
  obj = {}
  var ob;

  if(req.file.mimetype === 'application/zip' || req.file.mimetype === "application/x-zip-compressed"){
    const zip = new StreamZip({
      file:req.file.path,
      storeEntries: true
    })

    zip.on('ready', () => {
      
      for (const entry of Object.values(zip.entries())) {
        listaFicheiros.push(entry.name)
        if (entry.name != "manifesto.txt" && entry.name != "information.json")
        {
          broken = entry.name.split('.')
          if (broken[1] == "pdf" || broken[1] == "doc" || broken[1] == "png" || broken[1] == "jpg" || broken[1] == "jpeg") preview = "sim"
        }
      }

      if (existe("manifesto.txt",listaFicheiros)){ 
        
        data = zip.entryDataSync("manifesto.txt").toString('utf8');
        partida = data.split(" ")
        
        for (i in listaFicheiros)
          if (existe(listaFicheiros[i],partida) == false)
          {
            good = 0;
            goodManifesto = 0;
          } 
      }
      if(existe("information.json",listaFicheiros)){
        metadados = zip.entryDataSync("information.json").toString('utf-8');
        obj = JSON.parse(metadados)
        
        if (!(obj.hasOwnProperty('titulo') && obj.hasOwnProperty('dataCreation') && obj.hasOwnProperty('autor')))
        {
          good = 0;  
          goodInformation = 0;
        }
          
      }

      if(!existe("manifesto.txt",listaFicheiros) || !existe("information.json",listaFicheiros)) 
      {
        good = 0;
        if (!existe("manifesto.txt",listaFicheiros)) manifestoExiste = 0;
        else informationExiste = 0;
      }

      if(good == 1) 
      {
        if (obj.hasOwnProperty('subtitulo')) req.body.subtitulo = obj.subtitulo

        req.body.titulo = obj.titulo; 
        req.body.autor = obj.autor; 
        req.body.preview = preview

        req.body.dataRegisto = new Date().toISOString().slice(0, 10);
        zip.close();
        next();
        
      }
      else {
        /*manifestoExiste -> se tiver a 0 é porque zip nao tem um ficheiro manifesto.txt
        informationExiste -> se tiver a 0 é porque zip nao tem um ficheiro information.json
        goodManifesto -> se tiver a 0 é porque conteúdo do manifesto nao corresponde aos ficheiros todos que vieram no zip
        goodInformation -> se tiver a 0 é porque os campos de meta dados nao existem todos*/
        var aviso = []
        if (!manifestoExiste) aviso.push("Verifique que o zip tem o ficheiro manifesto.txt.")
        if (!informationExiste) console.log("Verifique que o zip tem o ficheiro information.json.")
        if (!goodManifesto) aviso.push("Verifique se o conteúdo do manifesto.txt corresponde a todos os ficheiros do zip.")
        if (!goodInformation) aviso.push("Verifique que o ficheiro information.json contém título, autor e dataCriação")
        res.render('upload', {tipo:req.body.tipo, hashtags:req.body.hashtags, aviso:aviso, vis:req.body.visibilidade, })
      } // por aqui codigo quando zip for invalido

    });
  }
  else{
    var aviso = ["O ficheiro tem de ser um zip."]
    res.render('upload', {tipo:req.body.tipo, hashtags:req.body.hashtags, aviso:aviso, vis:req.body.visibilidade, })
  }
}, function(req,res){

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
      req.body.fileName = req.file.originalname
      req.body.tipo = req.body.tipo.toLowerCase();
      newString = req.body.hashtags.replace(/\s+/g,' ').trim();
      req.body.hashtags = newString.split(" ")

      axios.post('http://localhost:8000/recurso?token=' + req.cookies.token,req.body)
        .then(dados => {
          res.redirect('/mainPage?tab=meus')
        })
        .catch(e => res.render('error', {error: e}))
    }
  })
})

//Download
router.get('/:recursoID/download', function(req,res) {
  axios.get('http://localhost:8000/recurso/' + req.params.recursoID + '?token=' + req.cookies.token)
    .then(dados => {
      res.download(path.normalize(__dirname+"/..") + '/public/fileStore/' + dados.data.fileName)
    })
    .catch(e => res.render('error', {error: e}))
})

module.exports = router;
