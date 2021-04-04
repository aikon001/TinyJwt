
const serviceLocator = require('../lib/service_locator');
const mongoose = serviceLocator.get('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
      type: String,
      unique: true
    },
    userid: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Tokens', tokenSchema);