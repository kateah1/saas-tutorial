// import packages
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String }
  },
  role: {
    type: String,
    enum: ['Member', 'Client', 'Owner', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
  {
    timestamps: true
  })

// pre-save of user to database, hash password if modified or new
UserSchema.pre('save', function (next) {
  const user = this
  const SALT_FACTOR = 5

  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(SALT_FACTOR, function (error, salt) {
    if (error) {
      return next(error)
    }

    bcrypt.hash(user.password, salt, null, function (error, hash) {
      if (error) {
        return next(error)
      }
      user.password = hash
      next()
    })
  })
})

// method to check user's password entered on login attempt against hashed password stored
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
    if (error) {
      return cb(error)
    }

    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
