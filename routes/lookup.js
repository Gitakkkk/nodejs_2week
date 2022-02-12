const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const authmiddlewares = require('../middlewares/auth-middleware');

const myblog = require('../schemas/blogSchema');
const commenting = require('../schemas/comment');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 글 작성
router.post('/posting', authmiddlewares, async (req, res) => {
  const { title, contents, date } = req.body;
  const { user } = res.locals;
  await myblog.create({ title, name: user['nickname'], contents, date });
  res.send({});
});

// 전체 글 조회
router.get('/posting', async (req, res) => {
  const blogs = await myblog.find().sort({ date: -1 });
  res.json({ list: blogs });
});

// 댓글 작성
router.post('/comment', authmiddlewares, async (req, res) => {
  const { comment, posting_url } = req.body;
  const { user } = res.locals;
  await commenting.create({ nickname: user['nickname'], comment, posting_url });
  res.send({});
});

// 댓글 조회
router.get('/comment', async (req, res) => {
  const comments = await commenting.find();
  res.json({ list_comment: comments });
});

// 댓글 수정
router.post('/comment/modify', async (req, res) => {
  const { comment_modify, id } = req.body;

  if (comment_modify.length === 0) {
    res.status(400).send({
      errorMessage: '내용이 없습니다.',
    });
    return;
  }

  await commenting.findByIdAndUpdate(id, { comment: comment_modify });
  res.send({});
});

// 댓글 삭제
router.post('/comment/delete', async (req, res) => {
  const { id } = req.body;
  await commenting.deleteOne({ id });
  res.send({});
});

// 회원가입
try {
  router.post('/users', async (req, res) => {
    const { nickname, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      res.status(400).send({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요',
      });
      return;
    }

    if (password.includes(nickname)) {
      res.status(400).send({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요',
      });
      return;
    }

    const existUsers = await User.findOne({
      $or: [{ nickname }],
    });
    if (existUsers) {
      res.status(400).send({
        errorMessage: '중복된 닉네임입니다',
      });
      return;
    }

    if (
      /^([A-Za-z0-9가-횡]{3,})$/.test(nickname) === false ||
      password.length < 3
    ) {
      res.status(400).send({
        errorMessage: '데이터 형식이 옳지 않습니다',
      });
      return;
    }

    const user = new User({ nickname, password });
    await user.save();

    res.status(201).send({ success: '회원가입에 성공했습니다!' });
  });
} catch (error) {
  res.status(400).send({
    errorMessage: '닉네임 또는 패스워드를 확인해주세요',
  });
  return;
}

// 로그인
router.post('/auth', async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ nickname });

  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: '닉네임 또는 패스워드를 확인해주세요',
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, 'secret-key');

  res.send({ token });
});

// 본인이 아닌 경우 댓글 수정/삭제 버튼 숨김
router.get('/comment/btn', authmiddlewares, async (req, res) => {
  const comments = await commenting.find();
  const { user } = res.locals;
  res.json({
    user,
    list_comment: comments,
  });
});

// 유저 정보 저장
router.get('/users/me', authmiddlewares, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});

module.exports = router;
