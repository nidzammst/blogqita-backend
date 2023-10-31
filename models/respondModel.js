const mongoose = require('mongoose')

var respondSchema = new mongoose.Schema({
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	},
	reply: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Respond'
		}
	],
	commenter: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	commentText: {
		type: String,
		required: true
	},
	likes: [
		{
			type: mongoose.Schema.ObjectId, ref: 'User'
		}
	],
	dislikes: [
		{
			type: mongoose.Schema.ObjectId, ref: 'User'
		}
	]
}, { timestamps: true })

module.exports = mongoose.model("Respond", respondSchema)