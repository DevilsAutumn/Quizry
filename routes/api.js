const router = require("express").Router();
const uploadImage = require("../middleware/uploadimage");
const uploadCtrl = require("../controllers/uploadCtrl");
const auth = require("../middleware/auth");
const apiCtrl = require("../controllers/apiCtrl");

router.post("/upload_avatar", uploadImage, auth, uploadCtrl.uploadAvatar);

router.get("/amount=:amount", apiCtrl.api);

module.exports = router;
