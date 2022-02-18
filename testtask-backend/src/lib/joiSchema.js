'use strict'
const Joi = require('joi')

module.exports.fetchProductJoi = Joi.object().keys({
  page_size: Joi.number().min(1).max(10).allow(null).default(5),
  page_number: Joi.number().min(1).allow(null).default(1)
})

module.exports.addProductJoi = Joi.object().keys({
  name: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Product name length cannot be less than 0.',
    'string.max': 'Product name length cannot be more than 50.',
    'any.required': 'Product name is required'
  }),
  price: Joi.number().min(10000).max(99999).required().messages({
    'number.min': 'Product price cannot be less than 10000.',
    'string.max': 'Product price cannot be more than 99999.',
    'any.required': 'Product price is required'
  }),
  image_url: Joi.string().required().messages({
    'any.required': 'Product image URL is required'
  })
})

module.exports.addToCartJoi = Joi.object().keys({
  product_id: Joi.string().required()
})

module.exports.updateCartItemJoi = Joi.object().keys({
  product_id: Joi.string().required(),
  action_type: Joi.string().valid('inc', 'dec').required()
})