import joi from 'joi'

export const emailSchema = 
  joi.string().pattern(new RegExp('gmail.com$')).required()

export const passwordSchema = joi.string().min(5).required()
export const title = joi.string().required()
export const price = joi.number().required()
export const available = joi.number().required()
export const category_code = joi.string().uppercase().alphanum().required()
export const image = joi.string().required()
export const bid = joi.number().required()
export const bids = joi.array().required()
