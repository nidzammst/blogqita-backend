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
		const post = await Post.findByIdAndUpdate(id, {
			$inc: { viewsCount: 1 },
		},
		{ new: true })
		.populate("likes")
		.populate("dislikes")
		res.json(post)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getAllPosts = asyncHandler(async (req, res) => {
	try{
		// Filtering

		/* For Search */
		const queryObj = { ...req.query }
		const excludeFields = ['page', 'sort', 'limit', 'fields']
		excludeFields.forEach(el => delete queryObj[el])
		let queryStr = JSON.stringify(queryObj)
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

		let query = Post.find(JSON.parse(queryStr))
		/* End For Search */

		// Sorting
		if(req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ')
			query = query.sort(sortBy)
		} else {
			query = query.sort('-createdAt')
		}

		// Limiting the Fields
		if(req.query.fields){
			const fields = req.query.fields.split(',').join(' ')
			query = query.select(fields)
		} else {
			query.select('-__v')
		}

		// Pagination
		const page = req.query.page
		const limit = req.query.limit
		const skip = (page - 1) * limit
		query = query.skip(skip).limit(limit)
		if(req.query.page) {
			const postCount = await Post.countDocuments()
			if(skip >= postCount) throw new Error("This Page does not Exists")
		}

		const posts = await Post.find(query)
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
	getAllPosts,
	updatePost,
}

/* Like and Dislike Controller in respondCtrl.js */