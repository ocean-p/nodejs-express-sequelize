import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8))

export const register = ({email, password}) => new Promise( async (resolve, reject) => {
  try {
    const response = await db.User.findOrCreate({
      where: {email},
      defaults: {
        email,
        password: hashPassword(password)
      }
    })
    const [user, created] = response

    const signObj = {
      id: user.id,
      email: user.email,
      role_code: user.role_code
    }

    const token = created 
      ? jwt.sign(signObj, process.env.JWT_SECRET, {expiresIn: '45s'})
      : null

    const refreshToken = created ?
      jwt.sign({id: user.id}, process.env.JWT_SECRET_REFRESH, {expiresIn: '2d'}) :
      null

    resolve({
      error: created ? 0 : 1,
      message: created ? 'Success to Register!' : 'Email already used',
      access_token: `Bearer ${token}`,
      refresh_token: refreshToken
    })

    if(refreshToken){
      await db.User.update({
        refresh_token: refreshToken
      }, {
        where: {id: user.id}
      })
    }
  } catch (error) {
    console.log(error)
    reject(error)
  }
})

export const login = ({email, password}) => new Promise( async (resolve, reject) => {
  try {
    const response = await db.User.findOne({
      where: {email},
      raw: true
    })

    const passwordChecked = response 
      && bcrypt.compareSync(password, response.password)

    const signObj = {
      id: response?.id,
      email: response?.email,
      role_code: response?.role_code
    }

    const token = passwordChecked ? 
      jwt.sign(signObj, process.env.JWT_SECRET, {expiresIn: '45s'}) : 
      null

    const refreshToken = passwordChecked ?
      jwt.sign({id: response.id}, process.env.JWT_SECRET_REFRESH, {expiresIn: '2d'}) :
      null

    resolve({
      error: response && token ? 0 : 1,
      message: token ? 'Success to Login!' : response ? 'Invalid password' : 'Email was not registered',
      access_token: token ? `Bearer ${token}` : token,
      refresh_token: refreshToken
    })

    if(refreshToken){
      await db.User.update({
        refresh_token: refreshToken
      }, {
        where: {id: response.id}
      })
    }
  } catch (error) {
    console.log(error)
    reject(error)
  }
})

export const refreshToken = ({refresh_token}) => new Promise( async (resolve, reject) => {
  try {
    const response = await db.User.findOne({
      where: {refresh_token}
    })

    const signObj = {
      id: response?.id,
      email: response?.email,
      role_code: response?.role_code
    }

    if(response){
      jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH, (err) => {
        if(err){
          resolve({
            error: 1,
            message: 'Refresh Token is expired, Required new login.'
          })
        } else{
          const accessToken = jwt.sign(signObj, process.env.JWT_SECRET, {expiresIn: '45s'})
          resolve({
            error: accessToken ? 0 : 1,
            message: accessToken ? 'Success to refresh Token!' : 'Fail to refresh Token',
            access_token: `Bearer ${accessToken}`,
            refresh_token
          })
        }
      })
    }
  } catch (error) {
    console.log(error)
    reject(error)
  }
})