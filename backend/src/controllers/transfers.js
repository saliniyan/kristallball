const Transfer = require('../models/transfer')
const Base = require('../models/base')
const EquipmentType = require('../models/equipmentType')

async function listTransfers(req, res, next) {
  try {
    const q = req.query || {}
    const filter = {}
    if (q.from || q.to) {
      filter.date = {}
      if (q.from) filter.date.$gte = new Date(q.from)
      if (q.to) { const d = new Date(q.to); d.setHours(23,59,59,999); filter.date.$lte = d }
    }
    if (q.fromBaseId) filter.fromBaseId = q.fromBaseId
    if (q.toBaseId) filter.toBaseId = q.toBaseId
    if (q.equipmentType) filter.equipmentTypeId = q.equipmentType
    const items = await Transfer.find(filter).sort({ date: -1 }).lean()
    res.json(items)
  } catch (err) { next(err) }
}

async function createTransfer(req, res, next) {
  try {
    const { date, fromBaseId, toBaseId, equipmentTypeId, quantity, reference } = req.body
    if (!fromBaseId || !toBaseId || !equipmentTypeId) return res.status(400).json({ error: 'fromBaseId, toBaseId and equipmentTypeId required' })
    if (fromBaseId === toBaseId) return res.status(400).json({ error: 'fromBaseId and toBaseId must be different' })
    const fromBase = await Base.findById(fromBaseId)
    const toBase = await Base.findById(toBaseId)
    const eq = await EquipmentType.findById(equipmentTypeId)
    const doc = await Transfer.create({
      date: date || new Date(),
      fromBaseId, fromBaseName: fromBase ? fromBase.name : '',
      toBaseId, toBaseName: toBase ? toBase.name : '',
      equipmentTypeId, equipmentName: eq ? eq.name : '',
      quantity, reference,
      createdBy: { id: req.user.id, role: req.user.role }, auditId: req.auditId
    })
    res.status(201).json(doc)
  } catch (err) { next(err) }
}

module.exports = { listTransfers, createTransfer }
