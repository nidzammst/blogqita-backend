const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const uniqid = require('uniqid')
const validateMongodbId = require('../utils/validateMongodbId')
const generatedToken = require('../config/jwtToken')
const generatedRefreshToken = require('../config/refreshToken')
const sendEmail = require('./emailCtrl')

const createUser = asyncHandler(async (req, res) => {
	const { firstname, lastname, email, password } = req.body
	const findUser = await User.findOne({ email })
	console.log(req.body)
	if(!findUser) {
		// Create a New User
		const newUser = await User.create({
			firstname,
			lastname,
			email,
			password
		})
		res.json(newUser)
	} else {
		throw new Error ("User Already Exist")
	}
})

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body
	const findUser = await User.findOne({ email })
	if(findUser && await findUser.isPasswordMatched(password) === true) {
		const refreshToken = await generatedRefreshToken(findUser?._id)
		const updateUser = await User.findByIdAndUpdate(findUser, { refreshToken },
			{ new: true })
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: 72 * 60 * 60 * 1000 // 3 days
		}).json({
			_id: findUser?._id,
			firstname: findUser?.firstname,
			lastname: findUser?.lastname,
			email: findUser?.email,
			token: generatedToken(findUser?._id)
		})
	} else {
		throw new Error ("Invalid Credentials")
	}
})

const getaUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try {
		const findUser = await User.findById(id)
		res.json(findUser)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getAllUser = asyncHandler(async (req, res) => {
	try {
		const users = await User.find()
		res.json(users)
	}
	catch (error) {
		throw new Error (error)
	}
})

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	const deletedUser = await User.findByIdAndDelete(id)
	res.json(deletedUser)
})

const updateUser = asyncHandler(async (req, res) => {
	const { _id } = req.user
	console.log(validateMongodbId)
	validateMongodbId(_id)
	try {
		const updatedUser = await User.findByIdAndUpdate(_id, req.body)
		res.json(updatedUser)
	}
	catch (error) {
		throw new Error (error)
	}
})

const handleRefeshToken = asyncHandler(async (req, res) => {
	const cookie = req.cookies
	if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
	const refreshToken = cookie.refreshToken
	const user = await User.findOne({ refreshToken })
	if(!user) throw new Error("No Refresh Token present in db or not matched")
	jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
		if(err || user.id !== decoded.id) {
			throw new Error("There is something wrong with refresh token")
		}
		const accessToken = generatedToken(user?._id)
		res.json({ accessToken })
	})
})

const logout = asyncHandler(async (req, res,) => {
	const cookie = req.cookies
	if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
	const refreshToken = cookie.refreshToken
	const user = await User.findOne({ refreshToken })
	if(!user) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: true
		})
		return res.status(204).json({ message: "no user found" }) //forbidden
	}
	await User.findOneAndUpdate({refreshToken}, {
		refreshToken: ""
	})
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: true
	})
	res.status(204) //forbidden
})

const blockUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try {
		const block = await User.findByIdAndUpdate(id, {
			isBlocked: true
		}, {
			new: true
		})
		res.json({
			message: "User has been Blocked"
		})
	} catch (error) {
		throw new Error(error)
	}
})

const unblockUser = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try {
		const unblock = await User.findByIdAndUpdate(id, {
			isBlocked: false
		}, {
			new: true
		})
		res.json({
			message: "User has been Unblocked"
		})
	} catch (error) {
		throw new Error(error)
	}
})

const updatePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user
	const { password } = req.body
	validateMongodbId(_id)
	if(password) {
		const user = await User.findById(_id)
		user.password = password
		const updatePassword = await user.save()
		res.json(updatePassword)
	} else {
		res.json(user)
	}
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
	const { email } = req.body
	const user = await User.findOne({ email })
	if(!user) throw new Error ("User Not Found with this email")
	try {
		const token = await user.createdPasswordResetToken()
		await user.save()
		const resetUrl = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
		const data = {
			to: email,
			text: "Hey User",
			subject: "Forgot Password Link",
			html: resetUrl
		}
		sendEmail(data)
		res.json(token)
	}
	catch (error) {
		throw new Error (error)
	}
})

const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body
	const { token } = req.params
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() }
	})
	if(!user) throw new Error ("Token expired, please try again later!")
	user.password = password
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save()
	res.json(user)
})

const addAuthor = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try {
		const author = await User.findByIdAndUpdate(id, { isAuthor: true })
		if(!author) res.json({ message: "User not Found" })
		res.json(author)
	}
	catch (error) {
		throw new Error (error)
	}
})

module.exports = {
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
}