const express = require('express')
const router = express.Router()
const {
	createUser,
	loginUser,
	getaUser,
	getAllUser,
	deleteUser,
	updateUser,
	handleRefeshToken,
	logout,
	blockUser,
	unblockUser,
	updatePassword,
	forgotPasswordToken,
	resetPassword,
	addAuthor
} = require('../controller/authCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/refresh', handleRefeshToken)
router.get('/logout', logout)
router.get('/:id', authMiddleware, isAdmin, getaUser)
router.get('/', authMiddleware, isAdmin, getAllUser)
router.put('/', authMiddleware, updateUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)
router.put('/add-author/:id', authMiddleware, isAdmin, addAuthor)
router.put('/password', authMiddleware, updatePassword)
router.put('/reset-password/:token', resetPassword)
router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.delete('/:id', authMiddleware, isAdmin, deleteUser)

module.exports = router