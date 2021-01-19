// Controlador para o modelo Tarefa

var Recurso = require('../models/recurso')

//////////////////////////////////////////// Consultar bd

// Devolve a lista de todos os Recursos
module.exports.listar = () => {
    return Recurso
        .find()
        .sort('titulo')
        .exec()
}

// Devolve a lista de todos os Recursos conforme visibilidade
module.exports.listarRec = v => {
    return Recurso
        .find({visibilidade: {$gte: v}})
        .sort('titulo')
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

// Devolve determinado recurso
module.exports.consultar = (v,id) => {
    return Recurso
        .findOne({visibilidade: {$gte: v}, id: id})
        .exec()
}

// Devolve recursos com determinada hashtag
module.exports.listarRecHashtags = (v,h) => {
    return Recurso
        .find({visibilidade: {$gte: v}, hashtags: h})
        .exec()
}

// Devolve a lista dos recursos de determinada visibilidade
/*module.exports.listarRecVisibilidade = v => {
    return Recurso
        .find({visibilidade: v})
        .sort('titulo')
        .exec()
}*/


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

// Altera recurso da bd
module.exports.alterar = function(r){
    return Recurso.findByIdAndUpdate({id: r.id}, r, {new: true})
}
