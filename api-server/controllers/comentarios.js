// Controlador para o modelo Tarefa

var Comentario = require('../models/comentarios')

//////////////////////////////////////////// Consultar bd

// Devolve a lista dos comentarios associados a um recurso ordenados por data
module.exports.listarByRecurso= id => {
    return Comentario
        .find({recursoID: id})
        .sort('data')
        .exec()
}

// Devolve a lista dos comentarios associados a um User ordenados por data
module.exports.listarByUser = id => {
    return Comentario
        .find({userID: id})
        .sort('data')
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

// Altera texto do comentario
module.exports.alterar = (id, conteudo) => {
    return User.findOneAndUpdate({_id:id},{$set: {texto:conteudo} });
}