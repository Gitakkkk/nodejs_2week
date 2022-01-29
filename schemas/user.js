const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: {
      type: String,
      match: /[A-Za-z0-9]{3,}/,
      default: "",
  },
  password: {
      type: String,
      match: /[A-Za-z0-9]{4,}/,
      default: "",
  },
});

// 프론트엔드에서 참조하는 값 : virtual
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);