const mongoose = require('mongoose')
const Schema = mongoose.Schema

const servicioSchema = new Schema ({
    name: String, 
    grpcs: Array
}, {versionKey: false})

module.exports = mongoose.model('services', servicioSchema)