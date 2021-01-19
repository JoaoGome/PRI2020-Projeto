const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    tipo: { type: String, required: true },
    titulo: String,
    dataCriação: String,
    dataRegisto: String,
    visibilidade: Number,
    autor: String,
    hashtags: [String]
  });

module.exports = mongoose.model('recurso', recursoSchema)