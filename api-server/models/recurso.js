const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    tipo: { type: String, required: true },
    titulo: String,
    dataRegisto: String,
    visibilidade: Number,
    autor: String,
    hashtags: [String],
    fileName: String
  });

module.exports = mongoose.model('recurso', recursoSchema)