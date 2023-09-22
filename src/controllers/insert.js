import * as services from '../services'

export const insertData = async(req, res) => {
  try {
    const response = await services.insertData()
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}