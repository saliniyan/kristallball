const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransferSchema = new Schema({
  date: { type: Date, default: Date.now },
  fromBaseId: String,
  fromBaseName: String,
  toBaseId: String,
  toBaseName: String,
  equipmentTypeId: String,
  equipmentName: String,
  quantity: Number,
  reference: String,
  createdBy: Schema.Types.Mixed,
  auditId: String
}, { timestamps: true })

module.exports = mongoose.model('Transfer', TransferSchema)
