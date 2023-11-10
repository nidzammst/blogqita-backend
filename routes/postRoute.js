const express = require('express')
const router = express.Router()

const {
	createPost,
	getaPost,
	getAllPosts,
	updatePost,
	deletePost,
	uploadImages,
} = require('../controller/postCtrl')

const {
	createTag,
	getAllTags,
	getATag,
	updateTag,
	deleteTag,
	followTags
} = require('../controller/tagsCtrl')

const {
	createCategory,
	getAllCategories,
	getACategory,
	updateCategory,
	deleteCategory
} = require('../controller/categoryCtrl')

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

const { authMiddleware, isAuthor, isAdmin } = require('../middlewares/authMiddleware')
const { uploadPhoto, postImgResize } = require('../middlewares/uploadImages')

router.get('/comment', getComments)
router.get('/comment/:id', getaComment)
router.get('/', getAllPosts)
router.get('/tags', getAllTags)
router.get('/categories', getAllCategories)
router.get('/:id', getaPost)
router.get('/tag/:id', getATag)
router.get('/category/:id', getACategory)
router.post('/create-post', authMiddleware, isAuthor, createPost)
router.post('/post-image/:id', authMiddleware, isAuthor, uploadPhoto.single('image'), postImgResize, uploadImages)
router.post('/comment/:id', authMiddleware, commentPost)
router.post('/reply/:id', authMiddleware, replyComment)
router.post('/create-tag', authMiddleware, isAuthor, createTag)
router.post('/create-category', authMiddleware, isAuthor, createCategory)
router.put('/comment/:id', authMiddleware, updateComment)
router.put('/like-post/:id', authMiddleware, likePost)
router.put('/dislike-post/:id', authMiddleware, dislikePost)
router.put('/like-comment/:id', authMiddleware, likeComment)
router.put('/dislike-comment/:id', authMiddleware, dislikeComment)
router.put('/update-tag/:id', authMiddleware, isAdmin, updateTag)
router.put('/follow-tag/:id', authMiddleware, followTags)
router.put('/category/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id', authMiddleware, deletePost)
router.delete('/comment/:id', authMiddleware, deleteComment)
router.delete('/tag/:id', authMiddleware, isAdmin, deleteTag)
router.delete('/category/:id', authMiddleware, isAdmin, deleteCategory)

module.exports = router