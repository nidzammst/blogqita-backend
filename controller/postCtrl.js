const Post = require('../models/postModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Tags = require('../models/tagsModel')
const fs = require('fs')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary')

const createPost = asyncHandler(async (req, res) => {
	const { id } = req.user
	validateMongodbId(id)
	try {
		const author = await User.findById(id)
		const {
			title,
			summary,
			content,
			tags,
			category
		} = req.body

		const newPost = await Post.create({
			title,
			summary,
			content,
			author
		})

		/* add tags post */
		await Promise.all(
			tags.map(async (someTag) => {
			let newTag = await Tags.findOneAndUpdate({ title: someTag }, {
				$push: { posts: newPost }
			}, { new: true })
			await newPost.updateOne({ $push: { tags: newTag } })
		}))

		/* add category post*/
		await Promise.all(
			category.map(async (someCategory) => {
			let newCategory = await Category.findOneAndUpdate({ title: someCategory }, {
				$push: { posts: newPost }
			}, { new: true })
			await newPost.updateOne({ $push: { category: newCategory } })
		}))
		res.json(newPost)
	}
	catch (error) {
		throw new Error (error)
	}
})

const uploadImages = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)

	try {
		const user = await User.findById(_id)
		const post = await Post.findById(id)
		const originalCoverUrl = 'https://res.cloudinary.com/dwvsytxrl/image/upload/v1698884305/szyfxegqu6rvnb4nur4e.jpg'
		const isThisAuthor = post.author._id.toString() === user._id.toString()
		if(!isThisAuthor) throw new Error ("You are not the author of this paper")

		const isCoverChanged = post.cover.url !== originalCoverUrl
		const uploader = (path) => cloudinaryUploadImg(path, 'image')
		const destroyer = (path) => cloudinaryDeleteImg(path, 'image')
		const { path } = req.file
		const newPath = await uploader(path)
		fs.unlinkSync(path)
		if(!isCoverChanged) {
			const findPost = await Post.findByIdAndUpdate(id, {
				cover: newPath
			})
			res.json(findPost)
		} else {
			const findPost = await Post.findById(id)
			const oldImgUrl = findPost.cover.public_id
			destroyer(oldImgUrl)
			const updateCover = await Post.findByIdAndUpdate(id, {
				cover: newPath
			}, { new: true })
			res.json(updateCover)
		}
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
			$inc: {
				viewsCount: 1,
				quality: .25
			},
		},
		{ new: true })
		.populate("likes")
		.populate("author")
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

const deletePost = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)
	try {
		const post = await Post.findById(id)
		const isThisAuthor = _id.toString() === post.author._id.toString()
		if(!isThisAuthor) throw new Error ("You are not the author of this paper")
		/* Regenerate Sequence */
		const posts = await Post.updateMany({ sec: { $gt: post.sec } }, {
			$inc: { sec: -1 }
		})
		const deletedPost = await Post.findByIdAndDelete(id)
		res.json(deletedPost)
	}
	catch (error) {
		throw new Error(error)
	}
})

module.exports = {
	createPost,
	getaPost,
	getAllPosts,
	updatePost,
	deletePost,
	uploadImages,
}

 // Like and Dislike Controller in respondCtrl.js 
