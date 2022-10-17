const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);

// // use를 사용하면 새로운 middleware 함수 추가 가능
// app.use((req, res, next) => {
//   console.log('In the middleware!');
//   next(); // 다음 middleware로 가게 함.
// });

// 모든 '/'에 적용
// /add-product도 가능
