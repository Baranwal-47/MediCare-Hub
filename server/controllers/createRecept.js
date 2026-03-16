const { Recept } = require("../models/receptModel");
const bcrypt = require('bcrypt');

const createRecept = async (req, res) => {
  try {
    const recept = await Recept.findOne({
      $or: [{ phno: req.body.phno }, { email: req.body.email }]
    });
    if (recept) return res.status(409).json({ message: "Phone or email already registered" });

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT) || 10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    await Recept({ ...req.body, password: hashedPass }).save();
    res.status(200).json({ message: "Receptionist Account Created" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error For Creating " + err });
  }
};

module.exports = { createRecept };