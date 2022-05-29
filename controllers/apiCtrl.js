const VerifiedQuestion = require("../models/VerifiedQuestionModel");
const apiCtrl = {
  api: async (req, res) => {
    function getStandardResponse(status, data) {
      return {
        status: status,
        data: data,
      };
    }
    try {
      const { amount } = req.params;
      if (amount > 30) {
        return res
          .status(500)
          .json({ msg: "Maximum amount of questions can be 30" });
      }
      const limit = Number(amount || 10);

      const { category, type, difficulty } = req.query;
      const settings = [];

      if (category) {
        settings.push({
          $match: {
            category,
          },
        });
      }
      if (difficulty) {
        settings.push({
          $match: {
            difficulty,
          },
        });
      }

      if (type) {
        settings.push({
          $match: {
            type,
          },
        });
      }

      settings.push(
        {
          $sample: {
            size: limit,
          },
        },
        {
          $unset: [
            "_id",
            "posted_by_id",
            "posted_by_name",
            "evaluated_by",
            "createdAt",
            "updatedAt",
            "__v",
          ],
        }
      );

      const data = await VerifiedQuestion.aggregate(settings);
      res.type("json");
      return res.send(getStandardResponse(200, data));
    } catch (err) {
      return res.status(500).json({ mgs: err.message });
    }
  },
};

module.exports = apiCtrl;
