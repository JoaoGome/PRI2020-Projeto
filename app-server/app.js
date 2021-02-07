var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios')
var dotenv = require('dotenv')

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

dotenv.config();

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'username'}, (username, password, done) => {
    axios.get('http://localhost:8002/users/' + username)
      .then(dados => {
        const user = dados.data
        if(!user) {  return done(null, false, {message: 'Utilizador inexistente!\n'})}
        if(password != user.password) { return done(null, false, {message: 'Credenciais inválidas!\n'})}
        return done(null, user)
      })
      .catch(e => done(e))
    })
)

/*
  Facebook OAuth Strategy
*/
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["emails", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      //console.log("TOKEN = " + accessToken);
      //console.log("REFRESH TOKEN = " + refreshToken);
      //console.log("PROFILE = "+JSON.stringify(profile));
      const email = profile.emails[0].value
      axios.get('http://localhost:8002/users/email/' + email)
        .then(dados => {
          const user = dados.data

          /*
            Caso o email não esteja registado na base de dados cria um novo user
          */
          if(!user) {
            var newUser = {
              "username": '',
              "level": "consumidor",
              "email": email,
              "dataRegisto": new Date().toISOString().slice(0, 10),
              "dataLastAcess": ''
            }

            done(null, newUser)
          }
          else
            done(null, user)
        })
        .catch(erro => { console.log('Facebook Strategy: ' + erro); done(erro)})
    }
  )
)

// Serialize/Deserialize by email
passport.serializeUser(function(user, done) {
  console.log('Serialize: ' + user.email)
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  axios.get('http://localhost:8002/users/email/' + email)
    .then(dados => {console.log('Deserialize: ' + dados.data); done(null, dados.data)})
    .catch(erro => done(erro, false))
});

/*
// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  console.log('Serielização, id: ' + user.username)
  done(null, user.username)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((uname, done) => {
  console.log('Desserielização, username: ' + uname)
  axios.get('http://localhost:8002/users/' + uname)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
})*/


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var recRouter = require('./routes/recurso');

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('PRI2020'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/recurso', recRouter);

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
