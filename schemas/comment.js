const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  nickname: {
    type: String,
  },

  posting_url: {
    type: String,
  },

  comment: {
    type: String,
  },
});

module.exports = mongoose.model('Commenting', CommentSchema);
