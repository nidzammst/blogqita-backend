const Category = require('../models/categoryModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createCategory = asyncHandler(async (req, res) => {
	const { title } = req.body
	try {
		const isCategoryCreated = await Category.findOne({ title })
		if(isCategoryCreated) throw new Error ("Error! Category already exists")
		const newCategory = await Category.create({
			title
		})
		res.json(newCategory)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getAllCategories = asyncHandler(async (req, res) => {
	const category = await Category.find()
	res.json(category)
})

const getACategory = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)

	try {
		const category = await Category.findById(id).populate({
			path: 'posts',
			options: {
				limit: 1, // Change it
				sort: { seq: -1 }
			}
		})
		res.json(category)
	}
	catch (error) {
		throw new Error (error)
	}
})

const updateCategory = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { title } = req.body
	validateMongodbId(id)
	try {
		const category = await Category.findByIdAndUpdate(id, {
			title
		}, { new: true })
		res.json(category)
	}
	catch (error) {
		throw new Error (error)
	}
})

const deleteCategory = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)

	try {
		const category = await Category.findByIdAndDelete(id)
		res.json(category)
	}
	catch (error) {
		throw new Error (error)
	}
})

module.exports = { createCategory, getAllCategories, getACategory, updateCategory, deleteCategory }