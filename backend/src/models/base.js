const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BaseSchema = new Schema({
  name: { type: String, required: true }
})

module.exports = mongoose.model('Base', BaseSchema)
