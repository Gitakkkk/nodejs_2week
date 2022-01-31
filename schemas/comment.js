const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  posting_url: {
    type: String,
  },

  comment: {
      type: String,
  },
});

// UserSchema.virtual("userId").get(function () {
//   return this._id.toHexString();
// });
// UserSchema.set("toJSON", {
//   virtuals: true,
// });
module.exports = mongoose.model("Commenting", CommentSchema);