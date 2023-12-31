import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { notAuth } from './handle_errors'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if(!token) return notAuth('Required Login', res)

  const accessToken = token.split(' ')[1]
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    const isExpired = err instanceof TokenExpiredError

    if(isExpired) return notAuth('Token is expired', res)

    if(err) return notAuth('Token is invalid', res)

    req.user = user
    next()
  })
}