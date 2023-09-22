import { Op } from 'sequelize'
import db from '../models'

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
      ...queries
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