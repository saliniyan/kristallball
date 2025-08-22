const Base = require('../models/base')
const EquipmentType = require('../models/equipmentType')

async function getBases(req, res, next) {
  try {
    const bases = await Base.find().lean()
    res.json(bases)
  } catch (err) { next(err) }
}

async function getEquipmentTypes(req, res, next) {
  try {
    const types = await EquipmentType.find().lean()
    res.json(types)
  } catch (err) { next(err) }
}

module.exports = { getBases, getEquipmentTypes }
