const Tags = require('../models/tagsModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createTag = asyncHandler(async (req, res) => {
	const { title } = req.body
	try {
		const isTagCreated = await Tags.findOne({ title })
		if(isTagCreated) throw new Error ("Error! Tag already exists")
		const newTag = await Tags.create({
			title
		})
		res.json(newTag)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getAllTags = asyncHandler(async (req, res) => {
	const tags = await Tags.find()
	res.json(tags)
})

const getATag = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)

	try {
		const tag = await Tags.findById(id).populate({
			path: 'posts',
			options: {
				limit: 1, // Change it
				sort: { seq: -1 }
			}
		})
		res.json(tag)
	}
	catch (error) {
		throw new Error (error)
	}
})

const updateTag = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { title } = req.body
	validateMongodbId(id)
	try {
		const tag = await Tags.findByIdAndUpdate(id, {
			title
		}, { new: true })
		res.json(tag)
	}
	catch (error) {
		throw new Error (error)
	}
})

const deleteTag = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)

	try {
		const tag = await Tags.findByIdAndDelete(id)
		res.json(tag)
	}
	catch (error) {
		throw new Error (error)
	}
})

const followTags = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)
	try {
		const tag = await Tags.findById(id)
		const user = await User.findById(_id)
		const isTagFollowed = tag?.followers.find((userId) => userId.toString() === _id.toString())
		if(!isTagFollowed) {
			const updatedTag = await Tags.findByIdAndUpdate(id, {
				$push: {
					followers: _id
				}
			}, { new: true })
			const updatedUser = await User.findByIdAndUpdate(_id, {
				$push: {
					tagsFollow: id
				}
			}, { new: true })
			res.json({ updatedTag, updatedUser })
		} else {
			const removeUserFromTag = await Tags.findByIdAndUpdate(id, {
				$pull: {
					followers: _id
				}
			}, { new: true })
			const removeTagFromFollowed = await User.findByIdAndUpdate(_id, {
				$pull: {
					tagsFollow: id
				}
			}, { new: true })
			res.json({ removeTagFromFollowed, removeUserFromTag })
		}
	}
	catch (error) {
		throw new Error (error)
	}
})

module.exports = { createTag, getAllTags, getATag, updateTag, deleteTag, followTags }