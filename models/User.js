const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    username: { type: String, required: true },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "email address is required"],
      match: [/\S+@\S+\.\S+/, "not a valid email address"],
      index: true,
    },
    articles: [{type: mongoose.Schema.Types.ObjectId, ref: "Article"}]
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);