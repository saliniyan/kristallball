require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Base = require('../models/base')
const EquipmentType = require('../models/equipmentType')
const User = require('../models/user')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to DB')

  await Base.deleteMany({})
  await EquipmentType.deleteMany({})
  await User.deleteMany({})

  const bases = await Base.insertMany([ { name: 'Alpha Base' }, { name: 'Bravo Base' }, { name: 'Charlie Base' } ])
  const eqs = await EquipmentType.insertMany([ { name: 'Vehicle' }, { name: 'Rifle' }, { name: 'Ammunition' } ])

  const pwd = await bcrypt.hash('password123', 10)
  const users = [
    { username: 'admin', passwordHash: pwd, name: 'Administrator', role: 'Admin' },
    { username: 'commander_alpha', passwordHash: pwd, name: 'Cmdr Alpha', role: 'BaseCommander', baseId: bases[0]._id.toString(), baseName: bases[0].name },
    { username: 'logistics', passwordHash: pwd, name: 'Logistics Officer', role: 'LogisticsOfficer' }
  ]
  await User.insertMany(users)

  console.log('Seed data inserted. Users: admin/password123, commander_alpha/password123, logistics/password123')
  process.exit(0)
}

seed().catch(err=>{ console.error(err); process.exit(1) })
