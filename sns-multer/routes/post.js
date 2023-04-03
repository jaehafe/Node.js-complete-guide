const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

// try {
//   rs.readdirSync('uploads');
// } catch (error) {
//   console.error('uploads 폴더가 없어 파일을 생성합니다.');
//   fs.mkdirSync('uploads');
// }
try {
  fs.readdirSync('uploads');
} catch (error) {
  if (error.code === 'ENOENT') {
    // uploads 폴더가 존재하지 않는 경우
    console.error('uploads 폴더가 없어 파일을 생성합니다.');
    fs.mkdirSync('uploads'); // 새로운 uploads 폴더 생성
  } else {
    // 다른 에러 발생한 경우
    throw error;
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

// 게시글 업로드, 게시글 쓸 때는 이미 이미지는 업로드 됨 upload.none()
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    // [#노드, #익스프레스]
    // [노드, 익스프레스]
    // [findOrCreate(노드), findOrCreate(익스프레스)]
    // [[해시태그, false], [해시태그, true]]
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      console.log('result>> ', result);
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
