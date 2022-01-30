const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: {
      type: String,
  },
  password: {
      type: String,
  },
});

UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);