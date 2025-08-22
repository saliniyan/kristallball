const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['Admin','BaseCommander','LogisticsOfficer'], required: true },
  baseId: { type: String }, // optional for Admin
  baseName: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
