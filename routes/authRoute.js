const express = require('express')
const router = express.Router()
const {
	createUser,
	loginUser,
	getaUser,
	getAllUser,
	deleteUser,
	updateUser,
	uploadImages,
	handleRefeshToken,
	logout,
	blockUser,
	unblockUser,
	updatePassword,
	forgotPasswordToken,
	resetPassword,
	addAuthor,
	followUnfollow,
	savePosts
} = require('../controller/authCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { uploadPhoto, profileImgResize } = require('../middlewares/uploadImages')

router.get('/refresh', handleRefeshToken)
router.get('/logout', logout)
router.get('/:id', authMiddleware, getaUser)
router.get('/', authMiddleware, getAllUser)
router.put('/', authMiddleware, updateUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)
router.put('/add-author/:id', authMiddleware, isAdmin, addAuthor)
router.put('/password', authMiddleware, updatePassword)
router.put('/reset-password/:token', resetPassword)
router.put('/fol-unfol/:id', authMiddleware, followUnfollow)
router.put('/save-post/:id', authMiddleware, savePosts)
router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.post('/post-image', authMiddleware, uploadPhoto.single('image'), profileImgResize, uploadImages)
router.delete('/:id', authMiddleware, isAdmin, deleteUser)

module.exports = router