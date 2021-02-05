// Controlador para o modelo Tarefa

var Recurso = require('../models/recurso')

//////////////////////////////////////////// Consultar bd



// Devolve a lista de todos os Recursos da pessoa
module.exports.listarRecPessoais = (v,u, f, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2

    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [ {"visibilidade":{$in: v}}, {"tipo": {$in: f}}, {"owner":u}, {"classificacao": {$gte: c}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
}

// Devolve determinado Recurso da pessoa
module.exports.consultarRecPessoal = (p, id) => {
    return Recurso
        .findOne({_id: id, owner:p})
        .exec()
}
// Devolve determinado Recurso 
module.exports.consultar = (v,id) => {
    return Recurso
        .findOne({visibilidade: {$gte: v}, _id: id})
        .exec()
}

// Devolve Recursos de uma pessoa
module.exports.listarRecUser = (v,u, f, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2
    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [ {"visibilidade":{$in: v}}, {"tipo": {$in: f}}, {"owner":u}, {"classificacao": {$gte: c}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
}

// Devolve a lista de todos os Recursos conforme visibilidade ----------------> nao usado
module.exports.listarRec = (v,s) => {
    var sort = {}
    sort[s] = 1
    return Recurso
        .find({visibilidade: {$gte: v}})
        .sort(sort)
        .exec()
}

// Devolve a lista de todos os Recursos ordenados e agrupados conforme visibilidade
module.exports.listarRecBy = (v, f, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2
    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [{"visibilidade": {$in: v}}, {"tipo": {$in: f}}, {"classificacao": {$gte: c}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
}

// Devolve a lista dos recursos de determinado titulo
module.exports.listarRecursosTitulo = (v, t, f, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2
    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [ {"visibilidade":{$in: v}}, {"tipo": {$in: f}}, {"titulo":{"$regex":t}}, {"classificacao": {$gte: c}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
}


// Devolve a lista dos recursos de determinado tipo ----------------> nao usado
module.exports.listarRecursosTipo = (v,t, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2
    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [ {"visibilidade":{$in: v}}, {"tipo":t}, {"classificacao": {$gte: c}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
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
module.exports.listarRecHashtags = (v,h, f, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2
    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [ {"visibilidade":{$in: v}}, {"tipo": {$in: f}}, {"hashtags": h}, {"classificacao": {$gte: c}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
}

// Devolve recursos desde data X
module.exports.consultarRecursoAfterData = (v,data, f, s1, s2, o1, o2, c) => {
    var sort2 = {}
    sort2[s2] = o2
    return Recurso
        .aggregate([
            { $sort: sort2 },
            { $match: {$and: [ {"visibilidade":{$in: v}}, {"tipo": {$in: f}}, {"hashtags": h}, {"classificacao": {$gte: c}}, {"dataRegisto": {$gt: data}} ]} },
            { $group: {
                _id: "$"+s1,
                recursos: { $push: { titulo: "$titulo", _id: "$_id", dataRegisto: "$dataRegisto", classificacao: "$classificacao", tipo: "$tipo", visibilidade: "$visibilidade", autor:"$autor", owner:"$owner"} }
            }},
            { $sort: {"_id":o1} }
            
        ])
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
