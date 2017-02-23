module.exports = {
  // secret key for JSON Web Tokens signing and encryption
  'secret': 'super secret passphrase',
  // database connection info
  'database': 'mongodb://localhost:27017',
  // set port for server
  'port': process.env.PORT || 3000
}
