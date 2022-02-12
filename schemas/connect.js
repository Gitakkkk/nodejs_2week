const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect('mongodb://localhost:27017/myblog').catch((err) => {
    console.error(err);
  });
};

module.exports = connect;
