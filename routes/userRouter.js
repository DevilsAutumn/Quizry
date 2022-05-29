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

router.get("/logout", userCtrl.logout);

router.patch("/update", auth, userCtrl.updateUser);

router.patch("/update_role/:id", auth, authAdmin, userCtrl.updateUserRole);

router.delete("/delete/:id", auth, authAdmin, userCtrl.deleteUser);

router.post("/add_question", auth, userCtrl.addQuestion);

router.post(
  "/evaluate_question/:id",
  auth,
  authEvaluator,
  userCtrl.approveQuestion
);

router.get("/my_questions/user=:id", auth, userCtrl.getUserQuestions);

router.get(
  "/pending_questions",
  auth,
  authEvaluator,
  userCtrl.getAllPendingQuestions
);

router.get(
  "/one_pending_question/:id",
  auth,
  authEvaluator,
  userCtrl.getOnePendingQuestion
);

router.get("/all_questions", userCtrl.getAllQuestions);

router.get("/questionStats", auth, userCtrl.getQuestionStats);

router.get("/stats", userCtrl.getStats);

router.get("/top_contributors", userCtrl.getTopContributors);

module.exports = router;
