import * as controllers from '../controllers'
import express from 'express'
import {verifyToken} from '../middlewares/verify_token'
import {isAdmin} from '../middlewares/verify_role'
import uploadCloud from '../middlewares/cloudinary.config'

const router = express.Router()

router.get('/', controllers.getBooks)

router.use(verifyToken)
router.use(isAdmin)
router.post('/', uploadCloud.single('image'), controllers.createBook)

module.exports = router
