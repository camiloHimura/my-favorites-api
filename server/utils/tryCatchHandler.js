const errorHandle = require("./errorHandler");

module.exports = (logic) => (req, res) => {
  try {
    logic(req, res);
  } catch (error) {
    errorHandle(error, res);
  }
};
