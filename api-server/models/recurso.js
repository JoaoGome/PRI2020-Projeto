const mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    titulo: String,
    dataRegisto: String,
    visibilidade: Number,
    dataCriacao: String,
    autor: String,
    owner: String,
    hashtags: [String],
    fileName: String,
    preview: String,
    classificacao: Number,
    classificacoes:[{
                      username: String,
                      classificacao: Number
                   }]
  });

module.exports = mongoose.model('recurso', recursoSchema)