const cors = require("cors");
const express = require("express");
const { json, urlencoded } = require("body-parser");

const tagRouter = require("./routes/tag");
const linkRouter = require("./routes/link");
const errorHandler = require("./utils/errorHandler");

const App = express();
App.use(cors());
App.use(json());
// Error-handling middleware always takes four arguments
App.use((error, req, res, next) => {
  if (error) {
    errorHandler(error, res);
  }
});

App.use(urlencoded({ extended: true }));

App.use("/api/tag", tagRouter);
App.use("/api/link", linkRouter);

module.exports = App;
