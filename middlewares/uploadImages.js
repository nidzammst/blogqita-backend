const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const multerStorage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, path.join(__dirname, '../tmp/images'))
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg')
	}
})

const multerFilter = (req, file, cb) => {
	if(file.mimetype.startsWith('image')) {
		cb(null, true)
	} else {
		cb({
			message: "Unsupported file format"
		}, false)
	}
}

const uploadPhoto = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: { fieldSize: 2000000 }
})

const postImgResize = async (req, res, next) => {
	if(!req.files) return next()
	await Promise.all(
		req.files.map(async (file) => {
			await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`tmp/images/posts/${file.filename}`)
			fs.unlinkSync(`public/images/posts/${file.filename}`)
		})
	)
	next()
}

const profileImgResize = async (req, res, next) => {
	if(!req.files) return next()
	await Promise.all(
		req.files.map(async (file) => {
			await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`tmp/images/profiles/${file.filename}`)
			fs.unlinkSync(`public/images/profiles/${file.filename}`)
		})
	)
	next()
}

module.exports = { uploadPhoto, postImgResize, profileImgResize }
