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
	tags: [String],
	category: [
	{
		type: String,
		enum: ["Travel", "Islam", "Film", "Music"]
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
	respond: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Respond'
		}
	]
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)