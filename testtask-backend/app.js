'use strict'

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000 // Better to read it from .env file

app.use(express.json())
app.use(cors())

require('./src/routes')(app)

app.listen(3000, (err, _result) => {
  if (err) {
    console.error(`Error while listening to port ${port}`)
    process.exit()
  }
  console.info(`Service is running on ${port}. Check service health on http://127.0.0.1:${port}`)
})