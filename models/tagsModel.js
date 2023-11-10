const mongoose = require('mongoose')

var tagsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post"
		}
	],
	followers: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
})

module.exports = mongoose.model("Tags", tagsSchema)