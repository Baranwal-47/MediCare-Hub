const { Token } = require("../models/tokModel");

const getTokensForToday = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const result = await Token.aggregate([
      { $unwind: "$tokens" },
      {
        $match: {
          "tokens.createdAt": { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: "$_id",
          tokens: { $push: "$tokens" },
        },
      },
    ]);

    res.status(200).json({ tokens: result });
  } catch (err) {
    return res.status(500).json({ message: "Server Error For Retrieving Tokens " + err });
  }
};

module.exports = { getTokensForToday };