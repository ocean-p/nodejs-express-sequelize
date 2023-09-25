import * as services from '../services'
import joi from 'joi'
import { emailSchema, passwordSchema, refreshTokenSchema } from '../helpers/joi_schema'
import { badRequest } from '../middlewares/handle_errors'

export const register = async (req, res) => {
  try {
    const {email, password} = req.body

    const {error} = joi.object({
      email: emailSchema,
      password: passwordSchema
    }).validate({email, password})

    if(error) return badRequest(error.details[0].message, res)

    const response = await services.register({email, password})
    return res.status(200).json(response)

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

export const login = async (req, res) => {
  try {
    const {email, password} = req.body

    const {error} = joi.object({
      email: emailSchema,
      password: passwordSchema
    }).validate({email, password})

    if(error) return badRequest(error.details[0].message, res)

    const response = await services.login({email, password})
    return res.status(200).json(response)

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const {error} = joi.object({
      refresh_token: refreshTokenSchema
    }).validate(req.body)

    if(error) return badRequest(error.details[0].message, res)

    const response = await services.refreshToken(req.body)
    return res.status(200).json(response)

  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}