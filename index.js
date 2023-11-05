const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const port = process.env.PORT || 4000

const authRouter = require('./routes/authRoute')
const postRouter = require('./routes/postRoute')
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const dbConnect = require('./config/dbConnect')
dbConnect()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api/user', authRouter)
app.use('/api/post', postRouter)
app.get('/', (req, res) => {
	res.json({
		message: '﷽',
	});
});
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
	console.log(`Server Running at port ${port}`)
})