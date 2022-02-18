// @ts-nocheck
'use strict'
const utils = require('../lib/utils')
const { addToCartJoi, updateCartItemJoi } = require('../lib/joiSchema')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

module.exports.addToCart = async (body) => {
  body = utils.validateJoi(addToCartJoi, body)

  let data = await fs.readFileSync(path.resolve('datasets/cart.json'), 'utf8')
  data = JSON.parse(data)

  const existingData = _.findIndex(data, { product_id: body.product_id })
  if (existingData !== -1) {
    throw {
      code: 500,
      message: 'Product already added into the cart.'
    }
  }

  body.quantity = 1
  await fs.writeFileSync(path.resolve('datasets/cart.json'), JSON.stringify([...[body], ...data], null, 2))
  return { data: true }
}

module.exports.getCartItems = async () => {
  let data = await fs.readFileSync(path.resolve('datasets/cart.json'), 'utf8')
  data = JSON.parse(data)

  if (!data || data.length === 0) {
    return []
  }

  let products = await fs.readFileSync(path.resolve('datasets/product.json'), 'utf8')
  products = JSON.parse(products)

  for (let elem of data) {
    const productDetails = _.find(products, { id: elem.product_id })
    if (productDetails) {
      elem = Object.assign(elem, productDetails)
      elem.subtotal = elem.price * elem.quantity
    }
  }

  return data
}

module.exports.updateCartItem = async (body) => {
  body = utils.validateJoi(updateCartItemJoi, body)
  console.log(body)

  let data = await fs.readFileSync(path.resolve('datasets/cart.json'), 'utf8')
  data = JSON.parse(data)

  const existingData = _.findIndex(data, { product_id: body.product_id })
  if (existingData === -1) {
    throw {
      code: 500,
      message: 'Product not found in cart. Please try after sometime.'
    }
  }
  console.log(existingData)

  data[existingData].quantity = body.action_type === 'inc' ? data[existingData].quantity + 1 : data[existingData].quantity - 1
  await fs.writeFileSync(path.resolve('datasets/cart.json'), JSON.stringify(data, null, 2))
  return { data }
}

module.exports.deleteItem = async (id) => {

  if (!id) {
    throw {
      code: 500,
      message: 'Please provide valid ID to delete item.'
    }
  }

  let data = await fs.readFileSync(path.resolve('datasets/cart.json'), 'utf8')
  data = JSON.parse(data)
  const index = _.findIndex(data, { product_id: id })
  if (index !== -1) {
    data.splice(index, 1)
  } else {
    throw {
      code: 400,
      message: 'No data found to delete.'
    }
  }
  await fs.writeFileSync(path.resolve('datasets/cart.json'), JSON.stringify(data, null, 2))
  return { data: true }
}