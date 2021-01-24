const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    level: String,
    email: String,
    filiacao: String,
    dataRegisto: String,
    dataLastAcess: String
  });

module.exports = mongoose.model('user', userSchema)