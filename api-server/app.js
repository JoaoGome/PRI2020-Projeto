var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jsonwebtoken')

var recsRouter = require('./routes/recursos');
var recRouter = require('./routes/recurso');
var usersRouter = require('./routes/users');
var comRouter = require('./routes/comentarios');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/GestaoRecursosPRI', 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next){
  var myToken = req.query.token || req.body.token;
  jwt.verify(myToken, 'PRI2020', function(e, payload){
    if(e) res.status(401).jsonp({error: 'Erro na verificação do token: ' + e})
    else{
      if(payload.level === "admin")
        req.user = { level: payload.level, username: payload.username, vis:1 }
      else
        req.user = { level: payload.level, username: payload.username, vis:2 }

      console.log("token good verificado")
      next()
    } 
  })
})

app.use('/recursos', recsRouter);
app.use('/recurso', recRouter);
app.use('/users', usersRouter);
app.use('/comentarios', comRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
