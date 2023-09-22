import express from 'express'
import user from './user'
import auth from './auth'
import insert from './insert'
import book from './book'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Home Nodejs')
})

router.use('/user', user)
router.use('/auth', auth)
router.use('/insert', insert)
router.use('/book', book)

module.exports = router




