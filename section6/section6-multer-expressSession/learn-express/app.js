const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); // 배포할 땐 app.use(morgan('combine'));
// app.use('요청 경로', express.static('실제 경로')): static
app.use('/', express.static(path.join(__dirname, 'public'))); // 정적파일
app.use(express.json()); // client에서 json Data를 보냈을 때, json Data를 파싱해서 req.body로 넣어줌
app.use(express.urlencoded({ extended: false })); // client에서 form submit할 때, true면 qs, false면 querystring
app.use(cookieParser(process.env.COOKIE_SECRET));
// req.session: 그 사용자에 대한 고유한 저장소 session
// req.session.id = 'hello' 요청마다 개인의 저장공간을 만들어주는게 express session
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      // session cookie, true로 해야지 js공격을 안 당함
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
  })
);

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/'); // 어디에 업로드할 지 (uploads/)
      // done(err, 'uploads/') // 에러처리는 이렇게
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 어떤 이름으로 올릴지
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 사이즈(5MB 이하)
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
  // upload객체를 라우터에 장착
  // upload.single: 한 개의 파일만 업로드
  // ('image'): <input type="file" name="image" />
  // 한 라우터에서만 upload 적용
  console.log(req.file);
  // 업로드에 대한 정보를  req.file에 담김
  res.send('ok');
});

// image가 많으면 upload.array('image')
app.post('/upload', upload.array('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});

// image가 multiple 일 때
app.post(
  '/upload',
  upload.fields([{ name: 'image1' }, { name: 'image2' }]),
  (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
  }
);

// image 존재하지 않는데 enctype="multipart/form-data"일 때: none
app.post('/upload', upload.none(), (req, res) => {
  req.body.title;
  res.send('ok');
});

app.get(
  '/',
  (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
  }
  // (req, res) => {
  //   throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
  // }
);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
