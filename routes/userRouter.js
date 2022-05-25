const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const authEvaluator = require("../middleware/authEvaluator");

router.post("/register", userCtrl.register);

router.post("/activation", userCtrl.activateEmail);

router.post("/login", userCtrl.login);

router.post("/refresh_token", userCtrl.getAccessToken);

router.post("/forgot", userCtrl.forgotPassword);

router.post("/reset", auth, userCtrl.resetPassword);

router.get("/info", auth, userCtrl.getUserInfo);

router.get("/all_users_info", auth, userCtrl.getAllUsersInfo);

router.get("/admin", auth, authAdmin, userCtrl.getAdminPanel);

router.get("/evaluator", auth, authEvaluator, userCtrl.getEvaluatorPanel);

router.get("/logout", userCtrl.logout);

router.patch("/update", auth, userCtrl.updateUser);

router.patch("/update_role/:id", auth, authAdmin, userCtrl.updateUserRole);

router.delete("/delete/:id", auth, authAdmin, userCtrl.deleteUser);

module.exports = router;
