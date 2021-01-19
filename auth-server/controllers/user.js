var User = require('../models/user')

// Devolve informação referente a um user
module.exports.consultar = uname => {
    return User.findOne({username: uname})
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

// alterar a password de um user
module.exports.alterarPwd = (uname,pwd) => {
    return User.findOneAndUpdate({username:uname},{$set: {password:pwd} });
}

// alterar a data de ultima acesso de um user
module.exports.alterarData = (uname,date) => {
    return User.findOneAndUpdate({username: uname}, {$set: {dataLastAcess: date}});
}





