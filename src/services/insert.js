import db from '../models'
import data from '../../data/data2.json'
import { generateCode } from '../helpers/fn'

export const insertData = () => new Promise( async (resolve, reject) => {
  try {
    const categories = Object.keys(data)
    categories.forEach(async (item) => {
      await db.Category.create({
        code: generateCode(item),
        value: item
      })
    })

    const dataArr = Object.entries(data)
    dataArr.forEach(item => {
      item[1].forEach(async (book) => {
        await db.Book.create({
          title: book.bookTitle,
          price: +book.bookPrice,
          image: book.imageUrl,
          category_code: generateCode(item[0])
        })
      })
    })
    resolve('OK')    
  } catch (error) {
    console.log(error)
    reject(error)
  }
})