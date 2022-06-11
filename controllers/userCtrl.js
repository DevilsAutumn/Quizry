const Users = require("../models/userModel");
const Question = require("../models/QuestionModel");
const VerifiedQuestion = require("../models/VerifiedQuestionModel");
const Contributor = require("../models/ContributorsModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const sendResetMail = require("./sendResetMail");

const { CLIENT_URL } = process.env;

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." });
      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid Email." });

      const user = await Users.findOne({ email });
      const username = await Users.findOne({ name });

      if (username)
        return res.status(400).json({ msg: "This Username already exists" });

      if (user)
        return res.status(400).json({ msg: "This email already exists" });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be of at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: passwordHash,
      };

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");
      res.json({
        msg: "User successfully registered! Please verify your email to activate your account.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { name, email, password } = user;
      const check = await Users.findOne({ email });

      if (check)
        return res.status(400).json({ msg: "This email already exists." });

      const newUser = new Users({
        name,
        email,
        password,
      });

      await newUser.save();

      res.json({ msg: "Congrats! Your email has been verified successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });
      const isWatch = await bcrypt.compare(password, user.password);
      if (!isWatch)
        return res.status(400).json({ msg: "Password is incorrect" });

      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      });

      res.json({ msg: "Login successfull !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });

        const access_token = createAccessToken({ id: user.id });

        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });

      if (!user)
        return res.status(400).json({ msg: "This email does not exist" });

      const access_token = createAccessToken({ id: user._id });

      const url = `${CLIENT_URL}user/reset/${access_token}`;

      sendResetMail(email, url, "Reset your password");
      res.json({ msg: "To reset the password, please check your mail." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserData: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllUsersInfo: async (req, res) => {
    try {
      const users = await Users.find().select("-password");

      res.json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
        }
      );

      await Question.updateMany(
        { posted_by_id: req.user.id },
        {
          posted_by_name: name,
        }
      );

      await VerifiedQuestion.updateMany(
        { posted_by_id: req.user.id },
        {
          posted_by_name: name,
        }
      ).catch((err) => {
        return;
      });

      await Contributor.updateOne(
        {
          id: req.user.id,
        },
        {
          name,
        }
      );

      res.json({ msg: "updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );

      res.json({ msg: "Role updated successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findOneAndDelete({ _id: req.params.id });

      res.json({ msg: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addQuestion: async (req, res) => {
    try {
      const { category, difficulty, question, type, options, correct_option } =
        req.body;

      const username = await Users.findById({ _id: req.user.id });
      const newQuestion = new Question({
        category,
        difficulty,
        question,
        type,
        options,
        correct_option,
        posted_by_id: req.user.id,
        posted_by_name: username.name,
        status: "Pending",
      });
      await newQuestion.save();
      await Contributor.findOneAndUpdate(
        {
          id: req.user.id,
        },
        {
          name: username.name,
          $inc: { totalcontribution: 1, pending: 1 },
        },
        {
          upsert: true,
        }
      );

      res.status(200).json({
        msg: "Your Question has been posted. Now please wait for evaluation.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  approveQuestion: async (req, res) => {
    try {
      const { reason, status } = req.body;
      const pendingQuestion = await Question.findById({ _id: req.params.id });
      const {
        category,
        difficulty,
        question,
        type,
        options,
        correct_option,
        posted_by_id,
        posted_by_name,
      } = pendingQuestion;

      await Question.findOneAndUpdate(
        { _id: req.params.id },
        {
          category,
          difficulty,
          question,
          type,
          options,
          correct_option,
          posted_by_id,
          posted_by_name,
          status,
          reason,
        }
      );

      if (status !== "Declined") {
        const newVerifiedQuestion = new VerifiedQuestion({
          category,
          difficulty,
          question,
          type,
          options,
          correct_option,
          posted_by_id,
          posted_by_name,
          evaluated_by: req.user.id,
        });

        await newVerifiedQuestion.save();
        await Contributor.findOneAndUpdate(
          {
            id: posted_by_id,
          },
          {
            $inc: { accepted: 1, pending: -1 },
          },
          {
            upsert: true,
          }
        );
      } else {
        await Contributor.findOneAndUpdate(
          {
            id: posted_by_id,
          },
          {
            $inc: { declined: 1, pending: -1 },
          },
          {
            upsert: true,
          }
        );
      }

      res.status(200).json({ msg: "Question Evaluated successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserQuestions: async (req, res) => {
    try {
      const UserQuestions = await Question.find({
        posted_by_id: req.params.id,
      }).sort({
        createdAt: -1,
      });

      return res.json(UserQuestions);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllPendingQuestions: async (req, res) => {
    try {
      const data = await Question.find({ status: "Pending" }).sort({
        createdAt: -1,
      });

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOnePendingQuestion: async (req, res) => {
    try {
      const data = await Question.find({ _id: req.params.id });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllQuestions: async (req, res) => {
    try {
      const data = await Question.find().sort({ createdAt: -1 });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getQuestionStats: async (req, res) => {
    try {
      const data = await Contributor.find({
        id: req.params.id,
      });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getStats: async (req, res) => {
    try {
      const data = await Contributor.aggregate([
        {
          $group: {
            _id: "",
            TotalQuestions: { $sum: "$totalcontribution" },
            AcceptedQuestions: { $sum: "$accepted" },
            DeclinedQuestions: { $sum: "$declined" },
            pendingQuestion: { $sum: "$pending" },
          },
        },
      ]);
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTopContributors: async (req, res) => {
    try {
      const data = await Contributor.find().sort({ accepted: -1 }).limit(5);

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
