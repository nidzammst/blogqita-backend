const { default: mongoose } = require('mongoose')

const dbConnect = async() => {
	try {
		const connect = mongoose.connect(`${process.env.MONGODB_URL}`)
		console.log("Database Connected successfully")
	}
	catch (error) {
		throw new Error (error)
	}
}

module.exports = dbConnect