const mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    recursoID: { type: String, required: true },
    userID: { type: String, required: true },
    recursoTitulo: String,
    text: String,
    data: String
  });

module.exports = mongoose.model('comentario', comentarioSchema)