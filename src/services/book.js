import { Op } from 'sequelize'
import db from '../models'
const cloudinary = require('cloudinary').v2

export const getBooks = ({page, limit, order, name, available, ...query}) => 
  new Promise( async (resolve, reject) => {
  try {
    const queries = {raw: true, nest: true}

    const offset = (!page || +page <= 1) ? 0 : (+page - 1)  
    const flimit = +limit || +process.env.LIMIT_BOOK
    
    queries.offset = offset * flimit
    queries.limit = flimit

    if(order) queries.order = [order]
    if(name) query.title = {[Op.substring]: name}
    if(available) query.available = {[Op.between]: available}

    const response = await db.Book.findAndCountAll({
      where: query,
      ...queries,
      attributes: {
        exclude: ['category_code']
      },
      include: [
        {
          model: db.Category,
          attributes: {exclude: ['createdAt', 'updatedAt']},
          as: 'categoryData'
        }
      ]
    })

    resolve({
      error: response ? 0 : 1,
      message: response ? 'Success to get Books!' : 'Fail to get Books',
      bookData: response
    })
  } catch (error) {
    console.log(error)
    reject(error)
  }
})

export const createBook = (body, fileData) => new Promise( async (resolve, reject) => {
  try {
    const response = await db.Book.findOrCreate({
      where: {
        title: body.title
      },
      defaults: {
        ...body,
        image: fileData?.path,
        filename: fileData?.filename
      }
    })

    const [book, created] = response

    resolve({
      error: created ? 0 : 1,
      message: created ? 'Success to create new Books!' : 'Fail to create new Book',
      bookData: book
    })
    
    if(fileData && !created) cloudinary.uploader.destroy(fileData.filename)
  } catch (error) {
    console.log(error)
    reject(error)
    if(fileData) cloudinary.uploader.destroy(fileData.filename)
  }
})

export const updateBook = ({id, ...body}, fileData) => new Promise( async (resolve, reject) => {
  try {
    if(fileData) body.image = fileData.path
    const response = await db.Book.update(body, {
      where: { id }
    })

    console.log(response)

    resolve({
      error: response[0] > 0 ? 0 : 1,
      message: response[0] > 0 ? `Success to update Book id:${id}!` : 
        `Fail to update Book id:${id}`
    })

    if(fileData && response[0] === 0) 
      cloudinary.uploader.destroy(fileData.filename)
  } catch (error) {
    console.log(error)
    reject(error)
    if(fileData) cloudinary.uploader.destroy(fileData.filename)
  }
})

export const deleteBook = ({ids}) => new Promise( async (resolve, reject) => {
  try {
    const response = await db.Book.findAll({
      where: {id: ids}
    })

    const images = response.map(item => item.filename)

    if(images.length > 0){
      cloudinary.api.delete_resources(images)
    }

    const responseDelete = await db.Book.destroy({
      where: {id: ids}
    })

    resolve({
      error: responseDelete > 0 ? 0 : 1,
      message: `${responseDelete} book(s) deleted!`
    })
    
  } catch (error) {
    console.log(error)
    reject(error)
  }
})