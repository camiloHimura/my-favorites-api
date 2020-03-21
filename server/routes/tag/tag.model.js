const mongoose = require("mongoose");
const { TAG_MODEL_NAME } = require("../constants");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color:{
    type: String,
    default: "2B4F7F"
  }
});

tagSchema.index({name: 1}, {unique: true});

tagSchema.pre("save", function(){
  this.name = this.name.toLowerCase();
})

module.exports = mongoose.model(TAG_MODEL_NAME, tagSchema);
