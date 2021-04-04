const { validateUser } = require('../validations/schemas');
const servicelocator = require('../configs/di');

require("dotenv")

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENTID,
  callbackURL: process.env.CALLBACKURL
},
function(accessToken, refreshToken, profile, done) {
  servicelocator.get('userController').createGoogle(profile.displayName.replace(/\s/g, ''),profile.emails[0].value,accessToken)
  userProfile=profile;
  return done(null, userProfile);
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports.register = (server, serviceLocator) => {

  const auth = require('../middlewares/auth')

  server.post(
    '/register',
    validateUser,
    (req, res, next) =>
      serviceLocator.get('userController').create(req, res, next)

  );

  server.post(
    '/login',
    auth.authenticateToken,
    (req, res, next) =>
      serviceLocator.get('userController').get(req, res, next)
  );


  server.get('/logingoogle',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  server.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
      res.send(userProfile)
    });
};