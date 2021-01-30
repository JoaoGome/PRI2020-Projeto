// Controlador para o modelo Tarefa

var Recurso = require('../models/recurso')

//////////////////////////////////////////// Consultar bd

// Devolve a lista de todos os Recursos     ----------> nao usado
module.exports.listar = () => {
    return Recurso
        .find()
        .sort('titulo')
        .exec()
}

// Devolve a lista de todos os Recursos da pessoa
module.exports.listarRecPessoais = (p,o) => {
    return Recurso
        .find({owner:p})
        .sort(o)
        .exec()
}

// Devolve determinado Recurso da pessoa
module.exports.listarRecPessoal = (p, id) => {
    return Recurso
        .findOne({owner:p, id:id})
        .exec()
}

// Devolve Recursos de uma pessoa
module.exports.listarRecUser = (v,u) => {
    return Recurso
        .find({visibilidade: {$gte: v}, owner:u})
        .exec()
}

// Devolve a lista de todos os Recursos conforme visibilidade
module.exports.listarRec = (v,o) => {
    return Recurso
        .find({visibilidade: {$gte: v}})
        .sort(o)
        .exec()
}

module.exports.listarRecBy = (v,s) => {
    return Recurso
        .aggregate([
            {$group: {
                _id: "$owner",
                recursos: { $push: { titulo: "$titulo", id: "$id", dataRegisto: "$dataRegisto", tipo: "$tipo", visibilidade: "$visibilidade"} }
                }},
                { "$sort": {"_id":1} }
        ])
}
// Devolve a lista dos recursos de determinado tipo -----------------> nao usado
module.exports.listarRecursosTitulo = (v,t,o) => {
    return Recurso
        .find({visibilidade: {$gte: v}, titulo: { "$regex":t }})
        .sort(o)
        .exec()
}

// Devolve a lista dos recursos de determinado tipo
module.exports.listarRecursosTipo = (v,t) => {
    return Recurso
        .find({visibilidade: {$gte: v}, tipo: t})
        .sort('titulo')
        .exec()
}

// Devolve a lista de tipos
module.exports.listarTipos = () => {
    return Recurso   
        .distinct('tipo')
}

// Devolve a lista de todos os Autores ----------> nao usado
module.exports.listarAutores = () => {
    return Recurso
        .distinct('autor')
}

// Devolve determinado recurso
module.exports.consultar = (v,id) => {
    return Recurso
        .findOne({visibilidade: {$gte: v}, id: id})
        .exec()
}

// Devolve determinado recurso
module.exports.consultarOwner = (id) => {
    return Recurso
        .findOne({id:id})
        .select('owner')
        .exec()
}

// Devolve recursos com determinada hashtag
module.exports.listarRecHashtags = (v,h) => {
    return Recurso
        .find({visibilidade: {$gte: v}, hashtags: h})
        .exec()
}



//////////////////////////////////////////// Alterar bd

// Insere recurso na bd
module.exports.inserir = r => {
    var novo = new Recurso(r)
    
    return novo.save()
}

// Elimina recurso da bd
module.exports.remover = function(id){
    return Recurso.deleteOne({id: id})
}

// Elimina recurso pessoal da bd
module.exports.removerPessoal = function(id, a){
    return Recurso.deleteOne({id: id, owner: a})
}

// Altera recurso da bd
module.exports.alterar = function(r){
    return Recurso.findOneAndUpdate({id: r.id}, r, {new: true})
}
