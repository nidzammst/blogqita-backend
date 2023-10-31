const jwt = require('jsonwebtoken')

const generatedToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

module.exports = generatedToken