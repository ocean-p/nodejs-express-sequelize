import * as services from '../services'
import { badRequest } from '../middlewares/handle_errors'
import { title, price, available, category_code, image, bid, bids } from '../helpers/joi_schema'
import joi from 'joi'
const cloudinary = require('cloudinary').v2

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
    const fileData = req.file
    console.log(fileData)

    const {error} = joi.object({
      title, price,
      available, category_code, image
    }).validate({...req.body, image: fileData?.path})

    if(error){
      if(fileData) cloudinary.uploader.destroy(fileData.filename)
      return badRequest(error.details[0].message, res)
    }

    const response = await services.createBook(req.body, fileData)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

export const updateBook = async(req, res) => {
  try {
    const fileData = req.file

    const {error} = joi.object({
      id: bid,
      // title, price,
      // available, category_code, image
    }).validate({id: req.body?.id})

    if(error){
      if(fileData) cloudinary.uploader.destroy(fileData.filename)
      return badRequest(error.details[0].message, res)
    }

    const response = await services.updateBook(req.body, fileData)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

export const deleteBook = async(req, res) => {
  try {
    const {error} = joi.object({
      ids: bids
    }).validate(req.query)

    if(error){
      return badRequest(error.details[0].message, res)
    }

    const response = await services.deleteBook(req.query)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}