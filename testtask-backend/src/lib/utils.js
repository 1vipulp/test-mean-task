'use strict'

module.exports.validateJoi = (joiSchema, dataToValidate) => {
  const joiResult = joiSchema.validate(dataToValidate)
  
  if (joiResult && joiResult.error) {
    let message = joiResult.error.message || joiResult.error.details[0].message
    message = message.replace(new RegExp(/[\\"]*/, 'gm'), '')
    const code = 400
    throw {
      message,
      code
    }
  }
  return joiResult.value
}