const mongoose = require("mongoose");

module.exports = async function inserManyDocs(model, length, data = {}) {
  const doc = Array.from({ length }, (_, index) => ({
    _id: new mongoose.Types.ObjectId(),
    ...data,
  }));

  return new Promise((resolutionFunc, rejectionFunc) => {
    model.insertMany(doc, function (err, docs) {
      resolutionFunc(docs);
    });
  });
};
