const Purchase = require('../models/purchase')
const Transfer = require('../models/transfer')
const Assignment = require('../models/assignment')
const Expenditure = require('../models/expenditure')

function buildFilter(q) {
  const f = {}
  if (q.from || q.to) {
    f.date = {}
    if (q.from) f.date.$gte = new Date(q.from)
    if (q.to) { const d = new Date(q.to); d.setHours(23,59,59,999); f.date.$lte = d }
  }
  if (q.baseId) f.baseId = q.baseId
  if (q.equipmentType) f.equipmentTypeId = q.equipmentType
  return f
}

async function summaryController(req, res, next) {
  try {
    const q = req.query || {}
    const filter = buildFilter(q)

    const [purchases, transfersIn, transfersOut, assignments, expenditures] = await Promise.all([
      Purchase.find(filter).lean(),
      Transfer.find(Object.assign({}, filter, q.toBaseId ? { toBaseId: q.baseId } : {})).lean(), // simplification
      Transfer.find(Object.assign({}, filter, q.fromBaseId ? { fromBaseId: q.baseId } : {})).lean(),
      Assignment.find(filter).lean(),
      Expenditure.find(filter).lean()
    ])

    const sum = arr => arr.reduce((s,x)=>s+(x.quantity||0),0)

    const openingBalance = 0 // backend should compute historically; simplified here
    const purchasesSum = sum(purchases)
    const transferInSum = sum(transfersIn)
    const transferOutSum = sum(transfersOut)
    const assignedSum = sum(assignments)
    const expendedSum = sum(expenditures)
    const closingBalance = openingBalance + purchasesSum + transferInSum - transferOutSum - expendedSum

    const recent = [
      ...purchases.slice(-5).map(x=>({ _id:x._id, kind:'Purchase', date:x.date, baseName:x.baseName, equipmentName:x.equipmentName, quantity:x.quantity, reference:x.reference })),
      ...transfersIn.slice(-5).map(x=>({ _id:x._id, kind:'Transfer', date:x.date, fromBaseName:x.fromBaseName, toBaseName:x.toBaseName, equipmentName:x.equipmentName, quantity:x.quantity, reference:x.reference })),
      ...assignments.slice(-5).map(x=>({ _id:x._id, kind:'Assign', date:x.date, baseName:x.baseName, equipmentName:x.equipmentName, quantity:x.quantity, assignedTo:x.assignedTo, reference:x.reference })),
      ...expenditures.slice(-5).map(x=>({ _id:x._id, kind:'Expend', date:x.date, baseName:x.baseName, equipmentName:x.equipmentName, quantity:x.quantity, reference:x.reference }))
    ].slice(-10).reverse()

    res.json({
      openingBalance, purchases: purchasesSum, transferIn: transferInSum, transferOut: transferOutSum,
      assigned: assignedSum, expended: expendedSum, closingBalance, recent
    })
  } catch (err) { next(err) }
}

async function netMovementDetailsController(req, res, next) {
  try {
    const q = req.query || {}
    const filter = buildFilter(q)
    const purchases = await Purchase.find(filter).lean()
    const transferIn = await Transfer.find(filter).lean()
    const transferOut = await Transfer.find(filter).lean()
    res.json({ purchases, transferIn, transferOut })
  } catch (err) { next(err) }
}

module.exports = { summaryController, netMovementDetailsController }
