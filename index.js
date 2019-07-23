//Require files
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

//Create express app
const app = express()

//Accpet json data and parse from body object
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//welcome page
app.get('/api', (req, res) => {
	res.json({
		message: "Welcome to the API"
	})
})


//Create posts
app.post('/api/posts', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err){
			res.sendStatus(403)
		}
		else{
			res.json({
				message: 'Post Created...',
				authData
			})
		}
	})
	
})


//Loign verification and jwt generate
//demo username: mehedi and password: nopassword
//We use hard password becuase we don't use database
app.post('/api/login', (req, res) => {

	if(req.body.username == "mehedi" && req.body.password == "nopassword"){
		const user = {
			id: 1,
			username:  req.body.username,
			password: req.body.password
		}

		// res.send(user)

		jwt.sign({ user: user }, 'secretkey', {
			expiresIn:100
		}, (err, token) => {
			res.json({
				token: token
			})
		})
	}
	else{
		res.send({
			message: "Username or Password not match"
		})
	}
	
	
})


//Verify jwt token and set into req.token
function verifyToken(req, res, next){
	// console.log(req.headers)
	const bearerHeader = req.headers['authorization']
	if(typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(' ')
		const bearerToken = bearer[1]
		req.token = bearerToken
		next()
	}
	else{
		res.sendStatus(403)
	}	
}


//Servr run on 3000 ports
app.listen(3000, () => {
	console.log("Server is running on port 3000")
})