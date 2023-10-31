const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.json({msg: "from respond route"})
})

module.exports = router