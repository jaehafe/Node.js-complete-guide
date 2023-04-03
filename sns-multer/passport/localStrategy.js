const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      // done(error, user, info);
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          console.log('exUser', exUser);
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

/**
 * done은 Passport.js에서 사용하는 콜백 함수.
 * Passport는 인증 작업을 수행할 때 사용자 정의 인증 로직을 수행하는 데 사용되는 전략(Strategies)을 구현할 수 있다.
 */
