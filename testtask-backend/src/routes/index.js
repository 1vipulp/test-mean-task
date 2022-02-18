'use strict'

const healthCheckRoute = require('./healthCheck')
const productRoute = require('./product')
const userRoute = require('./user')

module.exports = (app) => {
  app.use('/', healthCheckRoute)
  app.use('/user', userRoute)
  app.use('/product', productRoute)
}