const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const jwt = require("jsonwebtoken")
const User = require("../schemas/user")
const authmiddlewares = require("../middlewares/auth-middleware")

const myblog = require("../schemas/blogSchema");
const user = require('../schemas/user');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post("/posting", async (req, res) => {
    const { title, name, passWord, contents, date } = req.body;
    let createdData = await myblog.create({ title, name, passWord, contents, date });
    res.json({ createdData });
})

router.get("/posting", async (req, res) => {
    const blogs = await myblog.find().sort({ date: -1 })
    res.json({ list: blogs })
})

router.post("/users", async (req, res) => {
    const {nickname, password, confirmpassword} = req.body;
  
    if (password !== confirmpassword) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요",
        });
        return;
    }
  
    const existUsers = await User.findOne({
        $or: [{nickname}],
    });
    if (existUsers) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요"
        });
        return;
    }
  
    const user = new User({ nickname, password });
    await user.save();

    res.status(201).send({ success: "회원가입에 성공했습니다!"})
  });

  router.post("/auth", async (req, res) => {
      const {nickname, password} = req.body;
      console.log('router go')

      const user = await User.findOne({ nickname });

      if (!user || password !== user.password) {
          res.status(400).send({
              errorMessage: "닉네임 또는 패스워드를 확인해주세요"
          })
          return;
      }

      res.send({
          token: jwt.sign({ userId: user.userId}, "secret-key")
      });
      console.log('router complete')
  });

  router.get("/users/me", authmiddlewares, async (req, res) => {
      const {user} = res.locals;
      res.send({
          user,
      });
  })

module.exports = router;