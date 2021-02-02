var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv')

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

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

var User = require('./controllers/user')

dotenv.config();

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'username'}, (username, password, done) => {
    User.consultar(username)
      .then(dados => {
        const user = dados
        if(!user) {  return done(null, false, {message: 'Utilizador inexistente!\n'})}
        if(password != user.password) { return done(null, false, {message: 'Credenciais inválidas!\n'})}
        return done(null, user)
      })
      .catch(e => done(e))
    })
)


// Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["emails", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("TOKEN = " + accessToken);
      console.log("REFRESH TOKEN = " + refreshToken);
      console.log("PROFILE = "+JSON.stringify(profile));

      User.consultarByEmail(profile.emails[0].value)
        .then(dados => {
          const user = dados
          // Caso o email não exista na bd cria um novo utilizador
          if(!user) {
            var newUser = {
              "username": '',
              "level": "consumidor",
              "email": profile.emails[0].value,
              "dataRegisto": new Date().toISOString().slice(0, 10),
              "dataLastAcess": ''
            }
            User.inserir(newUser)

            done(null, newUser)
          }
          else
            done(null, user)
        })
        .catch(erro => { console.log('Facebook Strategy: ' + erro); done(erro)})

      //return done(null, profile);
    }
  )
)

// Serialize/Deserialize by email
passport.serializeUser(function(user, done) {
  console.log("Serialize: " + user)
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  console.log("Deserialize: " + email)
  User.consultarByEmail(email)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
});

// Indica-se ao passport como serializar o utilizador

/*passport.serializeUser((user,done) => {
  console.log('Serielização, id: ' + user.username)
  done(null, user.username)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((uname, done) => {
  console.log('Desserielização, username: ' + uname)
  User.consultar(uname)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
})*/

var usersRouter = require('./routes/users');

var app = express();


app.use(session({
  genid: req => {
    return uuidv4()
  },
  store: new FileStore({retries: 2}),
  secret: 'PRI2020',
  resave: false,
  saveUninitialized: false
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('PRI2020'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);

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
  //res.render('error');
  res.send()
});

module.exports = app;
