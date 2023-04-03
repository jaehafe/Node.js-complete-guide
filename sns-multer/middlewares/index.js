exports.isLoggedIn = (req, res, next) => {
  // req.isAuthenticated() 메서드는 현재 사용자가 인증되어 있으면 true를 반환하고, 그렇지 않으면 false를 반환
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};
