const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // { id: '3', connect.sid: 's%asdasdasd' }

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user, req.usAuthenticated()
    } catch (err) {
      done(err);
    }

    // try {
    //   const user = await User.findOne({ where: { id } });
    //   done(null, user);
    // } catch (err) {
    //   done(err);
    // }
  });

  local();
  kakao();
};

// passport.deserializeUser((id, done) => {
//   User.findOne({ where: { id } })
//     .then((user) => done(null, user))
//     .catch((err) => done(err));
// });
