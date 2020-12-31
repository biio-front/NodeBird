const passport = require('passport');
const { User } = require('../models');
const local = require('./local');

module.exports = () => {
  passport.serializeUser((user, done) => { 
    console.log('serializeUser');
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser');
    try {
      const user = await User.findOne({ where: { id }});
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};