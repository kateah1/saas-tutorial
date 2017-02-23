// import packages and config file
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('./config/main')
const router = require('./router')

// database connection
mongoose.connect(config.database)

// start the node server
app.listen(config.port)
console.log('Server is running on port ' + config.port)

// set up basic middleware for Express requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev')) // log requests to api using morgan

// enable CORS (secure cross-domain data transfers) from client-side
app.use(function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
  response.header('Access-Control-Allow-Credentials', 'true')
  next()
})

router(app)
