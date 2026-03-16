const { Token } = require("../models/tokModel");

const markTokenChecked = async (req, res) => {
  try {
    await Token.updateOne(
      { "tokens.token": parseInt(req.body.tokenId, 10) },
      { $set: { "tokens.$.checked": true } }
    );

    res.status(200).json({ message: "Token marked as checked" });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err });
  }
};

module.exports = { markTokenChecked };
