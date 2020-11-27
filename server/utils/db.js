const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/myLinks";

module.exports = {
  connect() {
    mongoose.connect(dbUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  },
  close() {
    mongoose.connection.close();
  },
};
