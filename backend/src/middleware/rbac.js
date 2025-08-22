// RBAC middleware helpers. Keep logic simple and documentable.
// Roles: Admin, BaseCommander, LogisticsOfficer

const canCreatePurchase = (req, res, next) => {
  const role = req.user.role
  // Admin and LogisticsOfficer can create purchases anywhere.
  if (role === 'Admin' || role === 'LogisticsOfficer') return next()
  // BaseCommander may create purchase only for their base
  if (role === 'BaseCommander' && req.body.baseId && req.body.baseId === req.user.baseId) return next()
  return res.status(403).json({ error: 'Forbidden: cannot create purchases' })
}

const canCreateTransfer = (req, res, next) => {
  const role = req.user.role
  // Admin & LogisticsOfficer can transfer between bases.
  if (role === 'Admin' || role === 'LogisticsOfficer') return next()
  // BaseCommander can create transfers only FROM their base (not between other bases)
  if (role === 'BaseCommander' && req.body.fromBaseId && req.body.fromBaseId === req.user.baseId) return next()
  return res.status(403).json({ error: 'Forbidden: cannot create transfers' })
}

const canCreateAssignment = (req, res, next) => {
  const role = req.user.role
  // Admin and BaseCommander can assign (BaseCommander only within their base)
  if (role === 'Admin') return next()
  if (role === 'BaseCommander' && req.body.baseId && req.body.baseId === req.user.baseId) return next()
  return res.status(403).json({ error: 'Forbidden: cannot create assignments' })
}

const canCreateExpenditure = (req, res, next) => {
  const role = req.user.role
  // Admin and BaseCommander can record expenditure (BaseCommander only within their base)
  if (role === 'Admin') return next()
  if (role === 'BaseCommander' && req.body.baseId && req.body.baseId === req.user.baseId) return next()
  return res.status(403).json({ error: 'Forbidden: cannot create expenditures' })
}

module.exports = { canCreatePurchase, canCreateTransfer, canCreateAssignment, canCreateExpenditure }
