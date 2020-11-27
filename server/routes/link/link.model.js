const mongoose = require("mongoose");
const { LINK_MODEL_NAME, TAG_MODEL_NAME } = require("../constants");

let linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "this path is Required"],
    validate: {
      validator: (item) => item.length > 3,
      message: "Invalid title format.",
    },
  },
  url: {
    type: String,
    required: [true, "this path is Required"],
    validate: {
      validator: (item) => /(http:|https:)/gi.test(item),
      message: "Invalid Url format.",
    },
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: TAG_MODEL_NAME,
    },
  ],
});

linkSchema.index({ title: 1, url: 1 }, { unique: true });

linkSchema.query.fillTags = function () {
  return this.populate("tags");
};

linkSchema.pre("save", function () {
  this.title = this.title.trim();
  this.url = this.url.trim();
});

module.exports = mongoose.model(LINK_MODEL_NAME, linkSchema);
