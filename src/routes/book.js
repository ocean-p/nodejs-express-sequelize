import * as controllers from '../controllers'
import express from 'express'
import {verifyToken} from '../middlewares/verify_token'
import {isModeratorOrAdmin} from '../middlewares/verify_role'
import uploadCloud from '../middlewares/cloudinary.config'

const router = express.Router()


router.use(verifyToken)
router.use(isModeratorOrAdmin)
router.get('/', controllers.getBooks)
router.post('/', uploadCloud.single('image'), controllers.createBook)
router.put('/', uploadCloud.single('image'), controllers.updateBook)
router.delete('/', controllers.deleteBook)

module.exports = router
