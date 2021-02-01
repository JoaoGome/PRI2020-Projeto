// Controlador para o modelo Tarefa

var Recurso = require('../models/recurso')

//////////////////////////////////////////// Consultar bd



// Devolve a lista de todos os Recursos da pessoa
module.exports.listarRecPessoais = (p,o) => {
    return Recurso
        .find({owner:p})
        .sort(o)
        .exec()
}

// Devolve determinado Recurso da pessoa
module.exports.consultarRecPessoal = (p, id) => {
    return Recurso
        .findOne({_id: id})
        .exec()
}

module.exports.consultar = (v,id) => {
    return Recurso
        .findOne({visibilidade: {$gte: v}, _id: id})
        .exec()
}

// Devolve Recursos de uma pessoa
module.exports.listarRecUser = (v,u,o) => {
    return Recurso
        .find({visibilidade: {$gte: v}, owner:u})
        .sort(o)
        .exec()
}

// Devolve a lista de todos os Recursos conforme visibilidade
module.exports.listarRec = (v,o) => {
    return Recurso
        .find({visibilidade: {$gte: v}})
        .sort(o)
        .exec()
}

// Devolve a lista de todos os Recursos ordenados por owner conforme visibilidade
module.exports.listarRecBy = (v,s) => {
    return Recurso
        .aggregate([
            {$group: {
                _id: "$owner",
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor"} }
                }},
                { "$sort": {"_id":1} },
                { "$match": {"recursos.visibilidade": {'$gte': v}} }
        ])
}
// Devolve a lista dos recursos de determinado titulo
module.exports.listarRecursosTitulo = (v,t,o) => {
    return Recurso
        .find({visibilidade: {$gte: v}, titulo: { "$regex":t }})
        .sort(o)
        .exec()
}

// Devolve a lista dos recursos de determinado tipo ----------------> nao usado
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
        .findOne({visibilidade: {$gte: v}, _id: id})
        .exec()
}

// Devolve determinado recurso  -----------------> nao usado
module.exports.consultarOwner = (id) => {
    return Recurso
        .findOne({_id:id})
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
    return Recurso.deleteOne({_id: id})
}

// Elimina recurso pessoal da bd
module.exports.removerPessoal = function(id, a){
    return Recurso.deleteOne({_id: id, owner: a})
}

// Elimina todos os recursos de um User
module.exports.removerRecUser = function(u){
    return Recurso.remove({userID: u})
}

// Elimina todos os comentarios de um determinado user da bd
module.exports.alterarRecPessoalVis = function(u, id, new_v){
    return Recurso.findOneAndUpdate({owner:u, _id:id},{$set: {visibilidade:new_v} })
}

// Altera recurso da bd
module.exports.alterar = function(r){
    return Recurso.findOneAndUpdate({_id: r.id}, r, {new: true})
}
