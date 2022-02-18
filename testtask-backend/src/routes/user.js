'use strict'

const router = require('express').Router()
const userHelper = require('../helpers/user')

router.put('/', userHelper.addToCart)
router.get('/', userHelper.getCartItems)
router.post('/', userHelper.updateCartItem)
router.delete('/:id', userHelper.deleteItem)

module.exports = router