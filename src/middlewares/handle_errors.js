import httpError from 'http-errors'

export const badRequest = (err, res) => {
  const error = httpError.BadRequest(err)
  return res.status(error.status).json({
    error: 400,
    message: error.message
  })
}

export const notAuth = (err, res) => {
  const error = httpError.Unauthorized(err)
  return res.status(error.status).json({
    error: 401,
    message: error.message
  })
}

export const internalServerError = (res) => {
  const error = httpError.InternalServerError()
  return res.status(error.status).json({
    error: 500,
    message: error.message
  })
}