import joi from 'joi'

export const emailSchema = 
  joi.string().pattern(new RegExp('gmail.com$')).required()

export const passwordSchema = joi.string().min(5).required()