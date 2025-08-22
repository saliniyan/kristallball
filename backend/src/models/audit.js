const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuditSchema = new Schema({
  auditId: { type: String, index: true },
  method: String,
  path: String,
  headers: Object,
  body: Schema.Types.Mixed,
  user: Schema.Types.Mixed,
  ip: String,
  ts: Date
}, { timestamps: true })

module.exports = mongoose.model('Audit', AuditSchema)
