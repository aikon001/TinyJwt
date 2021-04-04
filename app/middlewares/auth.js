const serviceLocator = require('../lib/service_locator');
const mongoose = serviceLocator.get('mongoose');
var jwt = require('jsonwebtoken');

module.exports.authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.SECRET, (err) => {
    if (err) {

      if (err.name == 'TokenExpiredError') {

        Tokens = mongoose.model("Tokens")

        Tokens.findOne({ token }, function (err, tokenObj) {
          if (tokenObj) {

            var decoded = jwt.decode(token, { complete: true })
            const { id } = decoded.payload

            Users = mongoose.model("Users")
            const { username } = req.body

            Users.findOne({ username }, function (err, userObj) {

              if (id == userObj._id) {

                Tokens.deleteOne({ userid: id }, function () {
                  let generatedToken = userObj.toAuthJSON()
                  res.send(generatedToken)
                });
              } else {
                err = (
                  `Token expired!`
                );
                res.send(err)
              }


            });
          }else{
            err = (
              `Invalid Token!`
            );
            res.send(err)

          }
        });

      }
      else {
        return res.sendStatus(403)
      }
    } else {
      next()
    }
  })

}

