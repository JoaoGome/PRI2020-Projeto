const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    titulo: String,
    dataRegisto: String,
    visibilidade: Number,
    autor: String,
    owner: String,
    hashtags: [String],
    fileName: String,
    preview: String
  });

module.exports = mongoose.model('recurso', recursoSchema)