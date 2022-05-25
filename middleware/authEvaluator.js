const Users = require("../models/userModel");

const authEvaluator = async (req, res, next) => {
  try {
    const user = await Users.findOne({ _id: req.user.id });

    if (user.role < 1)
      return res
        .status(500)
        .json({ msg: "Evaluator resources access denied." });

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authEvaluator;
