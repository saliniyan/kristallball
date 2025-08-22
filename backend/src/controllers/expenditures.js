const Expenditure = require('../models/expenditure')
const Base = require('../models/base')
const EquipmentType = require('../models/equipmentType')

async function listExpenditures(req, res, next) {
  try {
    const q = req.query || {}
    const filter = {}
    if (q.from || q.to) {
      filter.date = {}
      if (q.from) filter.date.$gte = new Date(q.from)
      if (q.to) { const d = new Date(q.to); d.setHours(23,59,59,999); filter.date.$lte = d }
    }
    if (q.baseId) filter.baseId = q.baseId
    if (q.equipmentType) filter.equipmentTypeId = q.equipmentType
    const items = await Expenditure.find(filter).sort({ date: -1 }).lean()
    res.json(items)
  } catch (err) { next(err) }
}

async function createExpenditure(req, res, next) {
  try {
    const { date, baseId, equipmentTypeId, quantity, reference } = req.body
    if (!baseId || !equipmentTypeId) return res.status(400).json({ error: 'baseId and equipmentTypeId required' })
    const base = await Base.findById(baseId)
    const eq = await EquipmentType.findById(equipmentTypeId)
    const doc = await Expenditure.create({
      date: date || new Date(),
      baseId, baseName: base ? base.name : '',
      equipmentTypeId, equipmentName: eq ? eq.name : '',
      quantity, reference,
      createdBy: { id: req.user.id, role: req.user.role }, auditId: req.auditId
    })
    res.status(201).json(doc)
  } catch (err) { next(err) }
}

module.exports = { listExpenditures, createExpenditure }
