const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExpenditureSchema = new Schema({
  date: { type: Date, default: Date.now },
  baseId: String,
  baseName: String,
  equipmentTypeId: String,
  equipmentName: String,
  quantity: Number,
  reference: String,
  createdBy: Schema.Types.Mixed,
  auditId: String
}, { timestamps: true })

module.exports = mongoose.model('Expenditure', ExpenditureSchema)
