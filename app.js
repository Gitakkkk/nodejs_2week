const express = require('express');
const connect = require("./schemas/connect");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const port = 3000;
const myblog = require("./schemas/blogSchema")
const comment = require("./schemas/comment")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("./schemas/user")
const authmiddlewares = require("./middlewares/auth-middleware")


connect();


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine", "ejs");
app.use(express.static("views/"))

const lookupRouter = require('./routes/lookup');
const { $where } = require('./schemas/blogSchema');

app.use('/api', lookupRouter)

app.get('/', (req, res) => {
  res.render('main', {});
});

app.get('/write', (req, res) => {
  res.render('write', {});
});

app.get('/detail', (req, res) => {
  res.render('detail', {});
});

app.get('/login', (req, res) => {
  res.render('login', {});
});

app.get('/register', (req, res) => {
  res.render('register', {});
});

app.get('/edit/:id', async (req, res) => {
  const post =  await myblog.findById(req.params.id)
  res.render('edit', {list: post});
});


app.get("/detail/:id", async (req, res) => {
  const {id} = req.params;
  const post = await myblog.findById(req.params.id);
  const comments = await comment.find({posting_url:id})

  res.render('detail', {list: post, comments});
})
 
app.post("/edit/:id/delete", async (req, res) => {
  const {passWord} = req.body
  const posting = await myblog.findById(req.params.id);
  if (Number(passWord) === posting['passWord']) {
  await myblog.deleteOne(({_id: req.params.id}))
  res.json({message:"삭제가 완료됐습니다."})
  } else {
    res.json({message: "비밀번호가 다릅니다."})
  }
})

app.post("/edit/:id/modify", async (req, res) => {
  const {title, name, passWord, contents, date} = req.body
  const posting = await myblog.findById(req.params.id);
  if (Number(passWord) === posting['passWord']) {
  await myblog.findByIdAndUpdate(req.params.id,{$set: {
    title:  title ,
    name:  name ,
    contents:  contents ,
    date:  date 
  }}).exec()
  res.json({message:"수정이 완료됐습니다."})
  } else {
    res.json({message: "비밀번호가 다릅니다."})
  }
})



app.listen(port, () => {
  console.log('연결되었습니다');
});