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
		type: String,
		required: true,
		default: 'https://cdn.icon-icons.com/icons2/2574/PNG/512/profile_picture_user_icon_153847.png'
	},
	viewsCount: {
		type: Number,
		default: 0
	},
	tags: [String],
	category: String,
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