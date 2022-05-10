const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema ({
    name: String, 
    types: Array
}, {versionKey: false})

module.exports = mongoose.model('messages', messageSchema)