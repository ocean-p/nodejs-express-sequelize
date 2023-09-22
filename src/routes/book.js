import * as controllers from '../controllers'
import express from 'express'
import {verifyToken} from '../middlewares/verify_token'
import {isAdmin} from '../middlewares/verify_role'

const router = express.Router()

router.get('/', controllers.getBooks)

router.use(verifyToken)
router.use(isAdmin)
router.post('/', controllers.createBook)

module.exports = router
