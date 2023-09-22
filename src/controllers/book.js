import * as services from '../services'
import { badRequest } from '../middlewares/handle_errors'
import { title, price, available, category_code } from '../helpers/joi_schema'
import joi from 'joi'

export const getBooks = async(req, res) => {
  try {
    const response = await services.getBooks(req.query)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

export const createBook = async(req, res) => {
  try {
    const {error} = joi.object({
      title, price,
      available, category_code
    }).validate(req.body)

    if(error) return badRequest(error.details[0].message, res)

    const response = await services.createBook(req.body)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}