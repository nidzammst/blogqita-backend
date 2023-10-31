const jwt = require('jsonwebtoken')

const generatedRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" })
}

module.exports = generatedRefreshToken