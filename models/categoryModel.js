const mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		enum: ["Food", "Travel", "Health", "Fashion", "Photography", "Personal", "Parenting", "Music", "Business", "Art and Design", "Book", "Writing", "Sports", "News", "Movie", "Religion", "Political", "Beauty", "Education", "Love and Relashionship", "Marketing", "Pets", "History", "Gaming", "Science", "Self-improvement"]
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	]
})

module.exports = mongoose.model("Category", categorySchema)