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
	content: {
		type: String,
		required: true
	},
	cover: {
		type: String,
		required: true,
		default: 'https://cdn.icon-icons.com/icons2/2574/PNG/512/profile_picture_user_icon_153847.png'
	},
	viewsCount: Number,
	tags: [String],
	category: [
		{
			type: String,
			enum: ["Sport", "News", "Religy", "Travel", "Film", "Music"]
		}
	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
		}
	],
	dislikes: [
		{
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
		}
	]
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)