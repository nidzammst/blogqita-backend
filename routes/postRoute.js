const express = require('express')
const router = express.Router()

const {
	createPost,
	getaPost,
	getAllPosts,
	updatePost,
} = require('../controller/postCtrl')
const {
	likePost,
	dislikePost,
	commentPost,
	replyComment,
	getComments,
	getaComment,
	deleteComment,
	likeComment,
	dislikeComment
} = require('../controller/respondCtrl')

const { authMiddleware, isAuthor } = require('../middlewares/authMiddleware')

router.get('/comment', getComments)
router.get('/comment/:id', getaComment)
router.get('/', getAllPosts)
router.get('/:id', getaPost)
router.post('/create-post', authMiddleware, isAuthor, createPost)
router.post('/comment/:id', authMiddleware, commentPost)
router.post('/reply/:id', authMiddleware, replyComment)
router.put('/:id', updatePost)
router.put('/like-post/:id', authMiddleware, likePost)
router.put('/dislike-post/:id', authMiddleware, dislikePost)
router.put('/like-comment/:id', authMiddleware, likeComment)
router.put('/dislike-comment/:id', authMiddleware, dislikeComment)
router.delete('/comment/:id', authMiddleware, deleteComment)

module.exports = router