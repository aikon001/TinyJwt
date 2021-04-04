const validator = require('../lib/validator');
const joi = require('joi');
const Joi = require('joi');


  module.exports.validateUser = (req, res, next) => {
    const schema = joi.object().keys({
      username: joi.string().alphanum().min(4).max(15).required(),
      password: Joi.string().min(3).max(15).required(),
      email: Joi.string()
    }).required();
    validator.validate(req, next, schema)
  }
  
