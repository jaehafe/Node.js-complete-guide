const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000);

// 미들웨어들은 next()를 해줘야 다음 라우터로 넘어감
app.use(
  (req, res, next) => {
    console.log('1 모든 요청에 실행');
    next();
  }
  // (req, res, next) => {
  //   try {
  //     console.log(11111);
  //   } catch (err) {
  //     next(err); // 에러처리 미들웨어로 바로 넘어감
  //   }
  // }
);

app.get(
  '/',
  (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    // res.send('안녕하세요'); // 두 번 이상 나오면 error
    // res.json({ hello: 'adam' }); // 두 번 이상 나오면 error
    if (true) {
      next('route');
    } else {
      next();
    }
  },
  (req, res) => {
    console.log('실행되나요?');
  }
);

app.post('/', (req, res) => {
  res.send('hello express!');
});

app.get('/category/:name', (req, res) => {
  res.send(`hello ${req.params.name}`);
});

app.get('/about', (req, res, next) => {
  // res.status(200).send('404 입니다')
  res.send('404');
});

// 에러 미들웨어: err, req, res, next 다 써야함
app.use((err, req, res, next) => {
  console.error(err);
  res.send('에러났습니다.');
});

app.listen(app.get('port'), () => {
  console.log('익스프레스 서버 실행');
});
