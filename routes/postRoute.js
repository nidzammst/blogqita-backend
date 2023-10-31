const express = require('express')
const router = express.Router()

const {
	createPost,
	getaPost,
	getPosts,
	updatePost
} = require('../controller/postCtrl')

const { authMiddleware, isAuthor } = require('../middlewares/authMiddleware')

router.get('/:id', getaPost)
router.get('/', getPosts)
router.post('/create-post', authMiddleware, isAuthor, createPost)
router.put('/:id', updatePost)

module.exports = router