const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

var userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	    required: 'Email is required',
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		unique: true,
		index: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "user",
		enum: ["user", "admin"]
	},
	isAuthor: {
		type: Boolean,
		default: false
	},
	isBlocked: {
		type: Boolean,
		default: false
	},

	isSettinged: {
		type: Boolean,
		default: false
	},
	profilePhoto: {
		type: Object,
		required: true,
		default: {
			url: "https://res.cloudinary.com/dwvsytxrl/image/upload/v1698884929/q3aejadv0clthv2wu7hy.png",
			asset_id: "65595bc9b8f2b94dfa441f983d314572",
			public_id: "q3aejadv0clthv2wu7hy"
		}
	},
	bio: {
		type: String,
		maxlength: 1000,
	},
	socialsAccounts: {
		"whatsapp": String,
		"instagram": String,
		"github": String,
		"facebook": String,
		"youtube": String,
		"tiktok": String,
		"telegram": String,
		"twitter": String,
		"linkedin": String,
		"snapchat": String,
		"discord": String,
		"pinterest": String,
		"reddit": String
	},
	following: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
	followers: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
	posts: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Post'
		}
	],
	savedPosts: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Post'
		}
	],
	tagsFollow: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Tags'
		}
	],
	refreshToken: {
		type: String,
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date
}, {
	timestamps: true,
})

userSchema.pre('save', async function(next) {
	if(!this.isModified('password')) {
		next()
	}
	const salt = await bcrypt.genSaltSync(10)
	this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.isPasswordMatched = async function(enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createdPasswordResetToken = async function() {
	const resetToken = crypto.randomBytes(32).toString('hex')
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000 // 10 minutes
	return resetToken
}

module.exports = mongoose.model("User", userSchema)