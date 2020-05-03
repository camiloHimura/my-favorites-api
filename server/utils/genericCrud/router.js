const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();

const { GENERIC_CRUD } = require("../../routes/constants");
GCrudModel = mongoose.model(GENERIC_CRUD, new mongoose.Schema({ title: { type: String }}));

const gCrud = require("./genericCrud");
const { findAll, create, findOne, findAndremove, findAndUpdate } = gCrud(GCrudModel);

router.route("/findAll")
  .get(findAll);

router.route("/findOne/:id")
  .get(findOne);

router.route("/findAndremove/:id")
  .get(findAndremove);

router.route("/findAndUpdate/:id")
  .post(findAndUpdate);

router.route("/create")
  .post(create)

module.exports = {
  router,
  CrudModel: GCrudModel
};
