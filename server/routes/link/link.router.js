const {Router} = require("express");
const {createWithTag, findAllByTags, findAllWithTag, findOneWithTag, removeTag, findAndremove} = require("./link.controller");

const LinkRouter = Router();

LinkRouter.route("/")
    .put(createWithTag)
    .get(findAllWithTag);

LinkRouter.route("/byTags/:tagIds")
    .get(findAllByTags)

LinkRouter.route("/:id")
    /* .put(create) */
    .get(findOneWithTag)
    .delete(findAndremove)

LinkRouter.route("/:id/:tagId")
    .put(removeTag)

module.exports = LinkRouter;
