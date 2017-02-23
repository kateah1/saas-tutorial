'use strict'

// import packages, config and user model
const jwt = require('jsonwebtoken')
require('crypto')
const User = require('../models/user')
const config = require('../config/main')

// generate a JWT from the user object we pass it
function generateToken (user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080
  })
}

// create function to be selective about what user info we pass through
function setUserInfo (request) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role
  }
}

// handler for login route
exports.login = function (request, response, next) {
  let userInfo = setUserInfo(request.user)

  response.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  })
}

// handler for registration route
exports.register = function (request, response, next) {
  // check for registration errors
  const email = request.body.email
  const firstName = request.body.firstName
  const lastName = request.body.lastName
  const password = request.body.password

  console.log('the email is', request.body.email)

  // return error if no email provided
  if (!email) {
    return response.status(422).send({ error: 'Please enter an email address' })
  }

  // return error if full name not provided
  if (!firstName || !lastName) {
    return response.status(422).send({ error: 'Please enter your full name' })
  }

  // return error if no password provided
  if (!password) {
    return response.status(422).send({ error: 'Please enter a password' })
  }

  User.findOne({ email: email }, function (error, existingUser) {
    if (error) {
      return next(error)
    }

    // if user is not unique return error
    if (existingUser) {
      return response.status(422).send({ error: 'That email is already in use' })
    }

    // if email is unique and password provided, create account
    let user = new User({
      email: email,
      password: password,
      profile: { firstName: firstName, lastName: lastName }
    })

    user.save(function (error, user) {
      if (error) {
        return next(error)
      }

      // respond with JWT if user was created
      let userInfo = setUserInfo(user)

      response.status(201).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
      })
    })
  })
}

// authorization middleware

// role auth check
exports.roleAuthorization = function (role) {
  return function (request, response, next) {
    const user = request.user

    User.findById(user._id, function (error, foundUser) {
      if (error) {
        response.status(422).json({ error: 'No user was found' })
        return next(error)
      }

      // if user is found, check role
      if (foundUser.role === role) {
        return next()
      }

      response.status(401).json({ error: 'Unauthorized' })
      return next('Unauthorized')
    })
  }
}
