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

router.get('/upload', verificaAutenticacao, function(req,res) {
  res.render('upload', {tipo:"", hashtags:"", vis:"3"})
})

// consultar recurso
router.get('/:id', function(req, res, next) {
  var myToken = req.cookies.token;
  var vis = 2
  if(req.query.vis) vis = req.query.vis
  var r = -1
  if(req.query.r) r = Number(req.query.r)

  if(vis == 1)
    axios.get('http://localhost:8000/recurso/pessoal/' + req.params.id + '?token=' + myToken)
      .then(dados =>{
        var rec = dados.data.dados
        var nivel = dados.data.level
        var cmt = dados.data.cmts.reverse()
        var user = dados.data.user
        
        var permitir = 0

        const zip = new StreamZip({
          file: 'public/fileStore/' + rec.fileName,
          storeEntries: true
        });
      
        zip.on('ready', () => {
            var filename
            const entries = zip.entries();
            for (const entry of Object.values(entries)) {
              if (["pdf","doc","png","jpg","jpeg"].includes(entry.name.split('.')[1]))
                filename = entry.name
            }
            console.log(filename)
            
            zip.extract(filename, './public/fileStore/tmp.' + rec.preview, err => {
                console.log(err ? 'Extract error' : 'Extracted');
                zip.close();
            });
            
        });

        if (nivel === "admin" || (user === rec.owner && nivel === "produtor")) permitir = 2
        else if (user === rec.owner) permitir = 1 
        if(dados.data == null) res.render('error', {error:"Não autorizado"})
        else res.render('recurso', {r:r, permitir:permitir, nivel:nivel, user:user, recurso:rec, comentarios: cmt})
        


        
      })
      .catch(e => res.render('error', {error:e})) 
      
  if(vis == 2 )
    axios.get('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
      .then(dados =>{ 
        var rec = dados.data.dados
        var nivel = dados.data.level
        var cmt = dados.data.cmts.reverse()
        var user = dados.data.user
        var permitir = 0

        const zip = new StreamZip({
          file: 'public/fileStore/' + rec.fileName,
          storeEntries: true
        });
      
        zip.on('ready', () => {
            var filename
            const entries = zip.entries();
            for (const entry of Object.values(entries)) {
              if (["pdf","doc","png","jpg","jpeg"].includes(entry.name.split('.')[1]))
                filename = entry.name
            }
            console.log(filename)
            
            zip.extract(filename, './public/fileStore/tmp.' + rec.preview, err => {
                console.log(err ? 'Extract error' : 'Extracted');
                zip.close();
            });
            
        });

        if (nivel === "admin" || (user === rec.owner && nivel === "produtor")) permitir = 2
        else if (user === rec.owner) permitir = 1 
        res.render('recurso', {r:r, permitir:permitir, nivel:nivel, user:user, recurso:rec, comentarios: cmt})

      })
      .catch(e => res.render('error', {error:e}))

});




//--------------------------------------- Recurso BD--------------------------------------------


// Eliminar um recurso
router.get('/:id/remover', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  var tab = "main"
  if (req.query.tab) tab = req.query.tab

  var r = -2
  if(req.query.r) r = Number(req.query.r) - 1

  axios.delete('http://localhost:8000/recurso/' + req.params.id + '?token=' + myToken)
    .then(dados => {
      var ref = req.query.ref
      if (ref.includes('user')){
        if (ref.includes('?')) ref += '&r=' + r
        else ref += '?r=' + r
      }
      if(ref) res.redirect(`${ref}`)
      else res.redirect(`/mainPage`)
    })  
    .catch(e => res.render('error', {error:e}))
})  


// Editar um recurso
router.get('/:id/editar', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  // alterar visibilidade do recurso
  if(req.query.visibilidade){
    var r = -2
    if(req.query.r) r = Number(req.query.r) -1
    axios.get('http://localhost:8000/recurso/' + req.params.id + '/alterar?visibilidade=' + req.query.visibilidade + '&token=' + myToken)
      .then(dados => res.redirect(`/user/${dados.data.username}/recursos?r=${r}`))
      .catch(e => res.render('error', {error:e}))
  }
  // ir para a pagina de editar recurso
  else{
    var r = -2
    if(req.query.r) r = Number(req.query.r) -2
    axios.get('http://localhost:8000/recurso/pessoal/' + req.params.id + '?token=' + myToken)
      .then(dados =>{
        var hashtags = dados.data.dados.hashtags[0]
        for(var i = 1; i < dados.data.dados.hashtags.length; i++)
          hashtags += " " + dados.data.dados.hashtags[i]
        res.render('recurso-edit', {r:r, recurso: dados.data.dados, hashtags: hashtags})
      })
      .catch(e => res.render('error', {error:e}))
  }
})

// Editar um recurso
router.get('/:id/classificar/:c', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;

  var r = -2
  if(req.query.r) r = Number(req.query.r) -1

  axios.get('http://localhost:8000/recurso/' + req.params.id + '/classificar/' + req.params.c + '?token=' + myToken)
    .then(dados => res.redirect(`/recurso/${req.params.id}?vis=${req.query.vis}&r=${r}`))
    .catch(e => res.render('error', {error:e}))

})

// Alterar um recurso
router.post('/editar/:id', verificaAutenticacao, function(req,res){
  var myToken = req.cookies.token;
  newString = req.body.hashtags.replace(/\s+/g,' ').trim();
  req.body.hashtags = newString.split(" ");
  req.body.tipo = req.body.tipo.toLowerCase();
  axios.put('http://localhost:8000/recurso?token=' + myToken, req.body)
    .then(dados => res.redirect(`/recurso/${req.params.id}?r=${req.query.r}&vis=1`))
    .catch(e => res.render('error', {error:e})) 
})


//--------------------------------------- Comment Section--------------------------------------------


// Adicionar comentário
router.post('/:id/comentario', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token;
  var r = -2
  if(req.query.r) r = Number(req.query.r) - 1
  axios.post('http://localhost:8000/comentarios/recurso/' + req.params.id + '?token=' + myToken, req.body)
    .then(dados =>{
      if(req.query.owner && (dados.data.username === req.query.owner || dados.data.level === "admin"))
        res.redirect(`/recurso/${req.params.id}?vis=1&r=${r}`)
      else 
        res.redirect(`/recurso/${req.params.id}?vis=2&r=${r}`)
    })
    .catch(e => res.render('error', {error:e}))
})



// Eliminar os comentarios de um recurso
router.get('/:rec/remover/comentarios', verificaAutenticacao, function(req,res) {
  var myToken = req.cookies.token
  var r = -2
  if(req.query.r) r = Number(req.query.r) - 1

  axios.delete('http://localhost:8000/comentarios/recurso/' + req.params.rec + '?token=' + myToken)
    .then(dados => res.redirect(`/recurso/${req.params.rec}?r=${r}`))
    .catch(e => res.render('error', {error:e}))
})





//Files section


function existe (a,b) {
  for (i = 0; i < b.length; i++)
    if (b[i] == a) return true
  return false
}


//Upload File
router.post('/upload',  verificaAutenticacao, upload.single('myFile'), function(req,res,next) {
  good = 1
  manifestoExiste = 1
  informationExiste = 1
  goodManifesto = 1
  goodInformation = 1
  preview = "nao"
  listaFicheiros = []
  obj = {}

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
          if (broken[1] == "pdf" || broken[1] == "doc" || broken[1] == "png" || broken[1] == "jpg" || broken[1] == "jpeg") preview = broken[1]
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
        
        if (!(obj.hasOwnProperty('titulo') && obj.hasOwnProperty('dataCriacao') && obj.hasOwnProperty('autor')))
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
        req.body.dataCriacao = obj.dataCriacao

        req.body.dataRegisto = new Date().toISOString().slice(0, 10);
        zip.close();
        next();
        
      }
      else {
        var aviso = []
        if (!manifestoExiste) aviso.push("Verifique que o zip tem o ficheiro manifesto.txt.")
        if (!informationExiste) console.log("Verifique que o zip tem o ficheiro information.json.")
        if (!goodManifesto) aviso.push("Verifique se o conteúdo do manifesto.txt corresponde a todos os ficheiros do zip.")
        if (!goodInformation) aviso.push("Verifique que o ficheiro information.json contém título, autor e dataCriação")
        
        var parentDir = path.normalize(__dirname+"/..");
        let quarantinePath = parentDir + '/' + req.file.path
        try {
          fs.unlinkSync(quarantinePath) //file removed
        } catch(err) {
          console.error(err)
        }

        res.render('upload', {tipo:req.body.tipo, hashtags:req.body.hashtags, aviso:aviso, vis:req.body.visibilidade, })
      } // por aqui codigo quando zip for invalido

    });
  }
  else{
    var parentDir = path.normalize(__dirname+"/..");
    let quarantinePath = parentDir + '/' + req.file.path
    try {
      fs.unlinkSync(quarantinePath) //file removed
    } catch(err) {
      console.error(err)
    }

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
      req.body.classificacao = -1
      req.body.classificacoes = []
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

//Download File
router.get('/:recursoID/download',  verificaAutenticacao, function(req,res) {
  axios.get('http://localhost:8000/recurso/' + req.params.recursoID + '?token=' + req.cookies.token)
    .then(dados => {
      res.download(path.normalize(__dirname+"/..") + '/public/fileStore/' + dados.data.dados.fileName)
    })
    .catch(e => res.render('error', {error: e}))
})

module.exports = router;
