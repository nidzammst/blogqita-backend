const Respond = require('../models/respondModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const likePost = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)

	try {
		const post = await Post.findById(id)

		// const isLiked = post?.isLiked
		const alreadyLiked = post?.likes.find((userId) => userId.toString() === _id.toString())
		const alreadyDisliked = post?.dislikes.find((userId) => userId.toString() === _id.toString())
		// If already disliked => remove id from dislikes
		if(alreadyDisliked) {
			const post = await Post.findByIdAndUpdate(id, {
				$push: { likes: _id },
				$pull: { dislikes: _id }
			}, {
				new: true
			})
			res.json(post)
		}
		// Cancel Like
		if(alreadyLiked) {
			const post = await Post.findByIdAndUpdate(id, {
				$pull: { likes: _id }
			}, {
				new: true
			})
			res.json(post)
		}
		// add _id to likes array
		else {
			const post = await Post.findByIdAndUpdate(id, {
				$push: { likes: _id }
			}, {
				new: true
			})
			res.json(post)
		}
		res.end()
	}
	catch (error) {
		throw new Error (error)
	}
})

const dislikePost = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)

	try {
		const post = await Post.findById(id)

		// const isLiked = post?.isLiked
		const alreadyLiked = post?.likes.find((userId) => userId.toString() === _id.toString())
		const alreadyDisliked = post?.dislikes.find((userId) => userId.toString() === _id.toString())

		// If already liked => remove id from likes
		if(alreadyLiked) {
			const post = await Post.findByIdAndUpdate(id, {
				$pull: { likes: _id },
				$push: { dislikes: _id }
			}, {
				new: true
			})
			res.json(post)
		}
		// Cancel Dislike
		if(alreadyDisliked) {
			const post = await Post.findByIdAndUpdate(id, {
				$pull: { dislikes: _id }
			}, {
				new: true
			})
			res.json(post)
		}
		// add _id to likes array
		else {
			const post = await Post.findByIdAndUpdate(id, {
				$push: { dislikes: _id }
			}, {
				new: true
			})
			res.json(post)
		}
		res.end()
	}
	catch (error) {
		throw new Error (error)
	}
})

const commentPost = asyncHandler(async (req, res) => {
	const { _id } = req.user
	const { id } = req.params
	validateMongodbId(_id)
	validateMongodbId(id)
	const { commentText } = req.body

	try {
		const comment = await Respond.create({
			postId: id,
			commenter: _id,
			commentText
		})
		const post = await Post.findByIdAndUpdate(id, {
			$push: {
				respond: comment._id
			}
		}).populate("respond")
		res.json(post)
	}
	catch (error) {
		throw new Error (error)
	}
})

const replyComment = asyncHandler(async (req, res) => {
	const { _id } = req.user
	const { id } = req.params
	validateMongodbId(_id)
	validateMongodbId(id)
	const { commentText } = req.body
	try {
		const comment = await Respond.create({
			postId: id,
			commenter: _id,
			commentText
		})
		const parentComment = await Respond.findByIdAndUpdate(id, {
			$push: {
				reply: comment._id
			}
		})
		res.json(parentComment).populate("reply")
	}
	catch (error) {
		throw new Error (error)
	}
})

const getComments = asyncHandler(async (req, res) => {
	try {
		const comments = await Respond.find()
		res.json(comments)
	}
	catch (error) {
		throw new Error (error)
	}
})

const getaComment = asyncHandler(async (req, res) => {
	const { id } = req.params
	validateMongodbId(id)
	try {
		const comment = await Respond.findById(id)
		res.json(comment)
	}
	catch (error) {
		throw new Error (error)
	}
})

const updateComment = asyncHandler(async (req, res) => {
	const { _id } = req.user
	const { id } = req.params
	validateMongodbId(_id)
	validateMongodbId(id)
	const { commentText } = req.body
	try {
		const comment = await Respond.findById(id)
		const isCommenter = comment?.commenter.toString() === _id.toString()
		if(!isCommenter) {
			throw new Error ("This is not your comment")
		} else {
			const updatedComment = await Respond.findByIdAndUpdate(id, {
				commentText: commentText
			}, { new: true })
			console.log("OK")
			res.json(updatedComment)
		}
	}
	catch (error) {
		throw new Error (error)
	}
})

const deleteComment = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)
	try {
		const comment = await Respond.findById(id)
		const isCommenter = comment?.commenter.toString() === _id.toString()
		if(!isCommenter) {
			throw new Error ("This is not your comment")
		} else {
			const deletedComment = await Respond.findByIdAndDelete(id)
		}
		res.json(comment)
	}
	catch (error) {
		throw new Error (error)
	}
})

const likeComment = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)

	try {
		const respond = await Respond.findById(id)

		// const isLiked = respond?.isLiked
		const alreadyLiked = respond?.likes.find((userId) => userId.toString() === _id.toString())
		const alreadyDisliked = respond?.dislikes.find((userId) => userId.toString() === _id.toString())
		// If already disliked => remove id from dislikes
		if(alreadyDisliked) {
			const respond = await Respond.findByIdAndUpdate(id, {
				$push: { likes: _id },
				$pull: { dislikes: _id }
			}, {
				new: true
			})
			res.json(respond)
		}
		// Cancel Like
		if(alreadyLiked) {
			const respond = await Respond.findByIdAndUpdate(id, {
				$pull: { likes: _id }
			}, {
				new: true
			})
			res.json(respond)
		}
		// add _id to likes array
		else {
			const respond = await Respond.findByIdAndUpdate(id, {
				$push: { likes: _id }
			}, {
				new: true
			})
			res.json(respond)
		}
		res.end()
	}
	catch (error) {
		throw new Error (error)
	}
})

const dislikeComment = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { _id } = req.user
	validateMongodbId(id)
	validateMongodbId(_id)

	try {
		const respond = await Respond.findById(id)

		// const isLiked = respond?.isLiked
		const alreadyDisliked = respond?.dislikes.find((userId) => userId.toString() === _id.toString())
		const alreadyLiked = respond?.likes.find((userId) => userId.toString() === _id.toString())
		// If already disliked => remove id from dislikes
		// Cancel Like
		if(alreadyLiked) {
			const respond = await Respond.findByIdAndUpdate(id, {
				$push: { dislikes: _id },
				$pull: { likes: _id }
			}, {
				new: true
			})
			res.json(respond)
		}
		if(alreadyDisliked) {
			const respond = await Respond.findByIdAndUpdate(id, {
				$pull: { dislikes: _id }
			}, {
				new: true
			})
			res.json(respond)
		}
		// add _id to likes array
		else {
			const respond = await Respond.findByIdAndUpdate(id, {
				$push: { dislikes: _id }
			}, {
				new: true
			})
			res.json(respond)
		}
		res.end()
	}
	catch (error) {
		throw new Error (error)
	}
})

module.exports = {
	likePost,
	dislikePost,
	commentPost,
	replyComment,
	getComments,
	getaComment,
	updateComment,
	deleteComment,
	likeComment,
	dislikeComment
}