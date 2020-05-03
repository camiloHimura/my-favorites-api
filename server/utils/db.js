const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/myLinks';

module.exports = {
  connect() {
    mongoose.connect(dbUrl, { useNewUrlParser: true });
  },
  close() {
    mongoose.connection.close()
  },
}