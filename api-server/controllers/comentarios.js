// Controlador para o modelo Tarefa

var Comentario = require('../models/comentarios')

//////////////////////////////////////////// Consultar bd

// Devolve a lista dos comentarios associados a um recurso ordenados por data
module.exports.listarByRecurso= id => {
    return Comentario
        .find({recursoID: id})
        .sort({'data':1})
        .exec()
}

// Devolve a lista dos comentarios associados a um User ordenados por data
module.exports.listarByUser = id => {
    return Comentario
        .find({userID: id})
        .sort({'data':1})
        .exec()
}

// Insere comentario na bd
module.exports.inserir = c => {
    var novo = new Comentario(c)
    return novo.save()
}

// Elimina comentario da bd
module.exports.remover = function(id){
    return Comentario.deleteOne({_id: id})
}

// Elimina comentario pessoal da bd
module.exports.removerPessoal = function(id, u){
    return Comentario.deleteOne({_id: id, userID:u})
}

// Elimina todos os comentarios de um determinado user da bd
module.exports.removerUser = function(u){
    return Comentario.remove({userID: u})
}

// Elimina todos os comentarios de um determinado user da bd
module.exports.deletedUser = function(u){
    return Comentario.updateMany(
        {userID:u},
        {$set: {userID:"[deleted]"}}
    )
}

// Elimina todos os comentarios de um determinado recurso da bd
module.exports.removerRecurso = function(r){
    return Comentario.remove({recursoID: r})
}

// Altera texto do comentario
module.exports.alterar = (id, conteudo) => {
    return User.findOneAndUpdate({_id:id},{$set: {texto:conteudo} });
}