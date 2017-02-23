// import
const AuthenticationController = require('./controllers/authentication')
const express = require('express')
require('./config/passport')
const passport = require('passport')

// passport middleware to require login/auth
passport.authenticate('jwt', { session: false })
passport.authenticate('local', { session: false })

module.exports = function (app) {
  // initialize route groups
  const apiRoutes = express.Router()
  const authRoutes = express.Router()

  // auth routes

  // set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes)

  // registration route
  authRoutes.post('/register', AuthenticationController.register)

  // login route
  authRoutes.post('/login', AuthenticationController.login)

  // set url for API group routes
  app.use('/api', apiRoutes)
}
