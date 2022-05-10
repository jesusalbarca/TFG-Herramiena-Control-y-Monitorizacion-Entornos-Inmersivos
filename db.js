const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/grpcDB";

mongoose.connect(url)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'error a conectar a mongodb'))
db.once('open', function callback(){
    console.log('Conectado a mongo db')
})

module.exports = db