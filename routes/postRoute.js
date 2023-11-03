const express = require('express')
const router = express.Router()

const {
	createPost,
	getaPost,
	getAllPosts,
	updatePost,
	uploadImages
} = require('../controller/postCtrl')
const {
	likePost,
	dislikePost,
	commentPost,
	replyComment,
	getComments,
	getaComment,
	updateComment,
	deleteComment,
	likeComment,
	dislikeComment,
} = require('../controller/respondCtrl')

const { authMiddleware, isAuthor } = require('../middlewares/authMiddleware')
const { uploadPhoto, postImgResize } = require('../middlewares/uploadImages')

router.get('/comment', getComments)
router.get('/comment/:id', getaComment)
router.get('/', getAllPosts)
router.get('/:id', getaPost)
router.post('/create-post', authMiddleware, isAuthor, createPost)
router.post('/post-image/:id', authMiddleware, isAuthor, uploadPhoto.single('image'), postImgResize, uploadImages)
router.post('/comment/:id', authMiddleware, commentPost)
router.post('/reply/:id', authMiddleware, replyComment)
router.put('/comment/:id', authMiddleware, updateComment)
router.put('/like-post/:id', authMiddleware, likePost)
router.put('/dislike-post/:id', authMiddleware, dislikePost)
router.put('/like-comment/:id', authMiddleware, likeComment)
router.put('/dislike-comment/:id', authMiddleware, dislikeComment)
router.delete('/comment/:id', authMiddleware, deleteComment)

module.exports = router