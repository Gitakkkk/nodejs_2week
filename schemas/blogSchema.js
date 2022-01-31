const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,   
    },
    name: {
        type: String,
    },
    passWord: {
        type: Number,
    },
    contents: {
        type: String,
    },
    date: {
        type: String,
    },
});

module.exports = mongoose.model("myblogs", blogSchema);