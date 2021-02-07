var User = require('../models/user')

// Devolve informação referente a um user
module.exports.consultar = uname => {
    return User.findOne({username: uname})
    .exec();
}

//listar utilizadores nivel X
module.exports.listarLevel = (l,o) => {
    return User.find({level: l})
            .sort(o)
            .exec();
}

// insere um user novo
module.exports.inserir = u => {
    var novo = new User(u);
    return novo.save();
}

// remove um user
module.exports.remove = uname => {
    return User.deleteOne({username: uname});
}

// alterar o level de um user
module.exports.alterarLevel = (uname,l) => {
    return User.findOneAndUpdate({username: uname},{$set: {level:l} });
}

// alterar o pedido de um user
module.exports.alterarPedido = (uname,p) => {
    return User.findOneAndUpdate({username: uname},{$set: {pedido:p} });
}


// alterar a password de um user
module.exports.alterarPwd = (uname,pwd) => {
    return User.findOneAndUpdate({username:uname},{$set: {password:pwd} });
}

// alterar a data de ultima acesso de um user
module.exports.alterarLastAcess = (uname,date) => {
    return User.findOneAndUpdate({username: uname}, {$set: {dataLastAcess: date}});
}

// alterar a data de last last acesso de um user
module.exports.alterarLastLastAcess = (uname,date) => {
    return User.findOneAndUpdate({username: uname}, {$set: {dataLastLastAcess: date}});
}


