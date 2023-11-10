const mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	article: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article'
	},
	cover: {
		type: Object,
		required: true,
		default: {
			url: 'https://res.cloudinary.com/dwvsytxrl/image/upload/v1698884305/szyfxegqu6rvnb4nur4e.jpg',
			asset_id: '791683e456719b212a4e03c3616d47e9',
			public_id: 'szyfxegqu6rvnb4nur4e'
		}
	},
	viewsCount: {
		type: Number,
		default: 0
	},
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag'
		}
	],
	category: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category'
		}
	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	dislikes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	sec: {
		type: Number,
		default: 1
	},
	quality: {
		type: Number,
		default: 0
	},
	respond: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Respond'
		}
	]
}, { timestamps: true })

postSchema.pre('save', async function(next) {
	const Post = this.constructor
	const [post] = await Post.find().sort({sec: -1}).limit(1)
	this.sec = post?.sec + 1
})

module.exports = mongoose.model("Post", postSchema)