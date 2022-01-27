const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();

const myblog = require("../schemas/blogSchema")

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

module.exports = router;