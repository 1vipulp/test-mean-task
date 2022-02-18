// @ts-nocheck
'use strict'
const utils = require('../lib/utils')
const { fetchProductJoi, addProductJoi } = require('../lib/joiSchema')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid').v4
const _ = require('lodash')

module.exports.fetchProducts = async (payload) => {
  const body = utils.validateJoi(fetchProductJoi, payload)
  let data = await fs.readFileSync(path.resolve('datasets/product.json'), 'utf8')
  data = JSON.parse(data)
  const offset = (Number(body.page_number) - 1) * body.page_size
  const limit = body.page_size
  console.log(limit)
  return limit ? data.slice(offset, offset + limit) : data
}

module.exports.addProduct = async (body) => {
  body = utils.validateJoi(addProductJoi, body)
  body.id = uuid()

  let data = await fs.readFileSync(path.resolve('datasets/product.json'), 'utf8')
  data = JSON.parse(data)

  for (const elem of data) {
    if (elem.name.toLowerCase() === body.name.toLowerCase()) {
      throw {
        code: 400,
        message: 'Product with same name already exists.'
      }
    }
  }

  await fs.writeFileSync(path.resolve('datasets/product.json'), JSON.stringify([...[body], ...data], null, 2))
  return { data: true }
}

module.exports.deleteProduct = async (id) => {

  if (!id) {
    throw {
      code: 500,
      message: 'Please provide valid ID to delete item.'
    }
  }

  let [ data, cartData ] = await Promise.all([
    fs.readFileSync(path.resolve('datasets/product.json'), 'utf8'),
    fs.readFileSync(path.resolve('datasets/cart.json'), 'utf8')
  ])
  data = JSON.parse(data)
  cartData = JSON.parse(cartData)
  const index = _.findIndex(data, { id })
  const cartDataIndex = _.findIndex(cartData, { product_id: id })
  if (index !== -1) {
    data.splice(index, 1)
  } else {
    throw {
      code: 400,
      message: 'No data found to delete.'
    }
  }
  if (cartDataIndex !== -1) {
    cartData.splice(cartDataIndex, 1)
  }
  await Promise.all([
    fs.writeFileSync(path.resolve('datasets/product.json'), JSON.stringify(data, null, 2)),
    fs.writeFileSync(path.resolve('datasets/cart.json'), JSON.stringify(cartData, null, 2))
  ])
  return { data: true }
}

module.exports.ediProduct = async (id, body) => {

  let data = await fs.readFileSync(path.resolve('datasets/product.json'), 'utf8')
  data = JSON.parse(data)
  const index = _.findIndex(data, { id })
  if (index !== -1) {
    data.splice(index, 1)
    data.unshift(Object.assign(body, { id }))
  } else {
    throw {
      code: 400,
      message: 'No data found to edit.'
    }
  }
  await fs.writeFileSync(path.resolve('datasets/product.json'), JSON.stringify(data, null, 2))
  return { data: true }
}