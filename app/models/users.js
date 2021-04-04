const serviceLocator = require('../lib/service_locator');
const mongoose = serviceLocator.get('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../configs/configs').secret;
require('./token')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      trim: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      unique: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      unique: true,
    },
    hash: String,
    salt: String
  },
  {
    timestamps: true
  }
);

// ############ methods for authentication ###################

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
   var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
   return this.hash === hash;
  };

userSchema.methods.validToken = function(token) {
  var decoded = jwt.decode(token, {complete: true})
  const { id } = decoded.payload

  return id == this._id
}

userSchema.methods.generateJWT = function(){
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate()+60)

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  },process.env.SECRET)
}

userSchema.methods.toAuthJSON = function(){     // ##### To return only to the specific User!!

  const tokenSchema = mongoose.model('Tokens');

  let newToken = new tokenSchema({
    token : this.generateJWT(),
    userid : this._id,
  })
  
  newToken.save();
  return newToken

  };

// ########################################################

module.exports = mongoose.model('Users', userSchema);