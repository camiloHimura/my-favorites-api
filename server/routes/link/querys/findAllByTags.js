const errorHandle = require("../../../utils/errorHandler");

module.exports = (model, arrayFormat) => async (req, res) => {
  try {
    const tagIds = req.params.tagIds.split(',').map(item => item.trim());
    let data = await model.find({ tags: {$in: [...tagIds] }}).fillTags().exec();
    if(!data){ return res.status(400).end() }

    res.status(200).send(arrayFormat(data));

  } catch(error) {
    errorHandle(error, res);
  }
}