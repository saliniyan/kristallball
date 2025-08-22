const Audit = require('../models/audit')
const { v4: uuidv4 } = require('uuid')

// auditMiddleware adds a lightweight audit record for each request and attaches x-audit-id
async function auditMiddleware(req, res, next) {
  try {
    const auditId = uuidv4()
    res.setHeader('x-audit-id', auditId)
    // create a minimal audit doc (async, don't block response)
    const doc = {
      auditId,
      method: req.method,
      path: req.originalUrl,
      headers: { authorization: !!req.headers.authorization },
      body: req.body,
      user: req.user ? { id: req.user.id, role: req.user.role, baseId: req.user.baseId } : null,
      ip: req.ip,
      ts: new Date()
    }
    // save but don't await to avoid slowing requests; handle errors
    Audit.create(doc).catch(err => console.error('Audit save error', err))
    // attach auditId to request for controllers to use in logs if desired
    req.auditId = auditId
  } catch (err) {
    console.error('audit middleware error', err)
  } finally {
    next()
  }
}

module.exports = { auditMiddleware }
