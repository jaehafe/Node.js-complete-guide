const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const User = require('../models/user');

const router = express.Router();

// 회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;

  try {
    const exUser = await User.findOne({ where: { email } });
    console.log('exUser', exUser);
    if (exUser) {
      return res.redirect('/join/error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 1. 먼저 passport가 localStrategy를 찾는다
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 세션쿠키를 브라우저로 보내준다.
      return res.redirect('/');
    });
  })(req, res, next);
});

// router.get('/logout', isLoggedIn, (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.redirect('/');
// });
router.get('/logout', isLoggedIn, (req, res) => {
  // req.logout();
  // req.session.destroy(() => {
  //   res.redirect('/');
  // });
  req.logout(() => {
    res.redirect('/');
  });
});

// kakao 로그인
router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  // 두 번째 매개변수는 인증이 완료된 후 실행할 콜백 함수를 지정
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
