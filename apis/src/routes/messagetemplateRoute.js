const express = require("express");
const router = express.Router();
const { handle } = require("../app/middleware/auth");
const MessageTemplate = require("../app/controllers/messagetemplateController");

const messageTemplateInstance = new MessageTemplate();

router.get("/template/get/:key?", handle, messageTemplateInstance.get);
router.post("/template/create", handle, messageTemplateInstance.create);
router.patch("/template/update/:key", handle, messageTemplateInstance.update);
router.delete("/template/delete/:key", handle, messageTemplateInstance.delete);

module.exports = router;
