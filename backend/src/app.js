require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const routes = require('./routes')
const { auditMiddleware } = require('./middleware/audit')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// audit middleware should run after body parsing but before routes to capture requests
app.use(auditMiddleware)

app.use('/api', routes)

// error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log('Server listening on', PORT))
  } catch (err) {
    console.error('Startup error', err)
    process.exit(1)
  }
}

start()
