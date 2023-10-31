const Post = require('../models/postModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createPost = asyncHandler(async (req, res) => {
	try {
		const newPost = await Post.create(req.body)
		res.json(newPost)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getaPost = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try{
		const post = await Post.findById(id)
		res.json(post)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getPosts = asyncHandler(async (req, res) => {
	try{
		const posts = await Post.find()
		res.json(posts)
	}
	catch (error) {
		throw new Error (error)
	}
})

const updatePost = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try{
		const post = await Post.findByIdAndUpdate(id, req.body)
		res.json(post)
	}
	catch (error) {
		throw new Error (error)
	}
})

module.exports = {
	createPost,
	getaPost,
	getPosts,
	updatePost
}