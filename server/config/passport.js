// import passport, user model, main config, strategies
const passport = require('passport')
const User = require('../models/user')
const config = require('./main')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// we want passport to use email field rather than username field
const localOptions = { usernameField: 'email' }

// setup local login strategy to authenticate users with email and password
// a successful login will yield the user a JWT to use to authenticate future requests automatically
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  User.findOne({ email: email }, function (error, user) {
    if (error) {
      return done(error)
    }
    if (!user) {
      return done(null, false, { error: 'Access denied' })
    }

    user.comparePassword(password, function (error, isMatch) {
      if (error) {
        return done(error)
      }
      if (!isMatch) {
        return done(null, false, { error: 'Access denied' })
      }

      return done(null, user)
    })
  })
})

// set up JWT authentication options
const jwtOptions = {
  // tell passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // tell passport where to find the secret
  secretOrKey: config.secret
}

// set up JWT login strategy and pass options through
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload._id, function (error, user) {
    if (error) {
      return done(error, false)
    }
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// allow passport to use the strategies we defined
passport.use(jwtLogin)
passport.use(localLogin)
