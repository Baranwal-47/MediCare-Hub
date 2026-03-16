const { Token } = require("../models/tokModel");
const { Doc } = require("../models/docModel");
const { Pats } = require("../models/patModel");

const retrieveSingleToken = async (req, res) => {
  try {
    if (req.body.id) {
      const tokenValue = parseInt(req.body.id);
      const result = await Token.aggregate([
        { $match: { "tokens.token": tokenValue } },
      ]);
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "Token not found" });
      }
      const results1 = result[0].tokens.find(
        (data) => data.token === tokenValue
      );
      if (!results1) {
        return res.status(404).json({ message: "Token not found" });
      }
      const docsDetails = await Doc.findById(results1.docs);
      const patientDetails = await Pats.findById(results1.patient);
      if (!docsDetails || !patientDetails) {
        return res.status(404).json({ message: "Doctor or Patient not found" });
      }
      const combinedData = await buildCombinedData(patientDetails);
      return res.status(200).json({
        data: buildResponseData(results1, docsDetails, patientDetails, combinedData),
      });

    } else if (req.body.patNo) {
      const patientDetails = await Pats.findOne({ phno: req.body.patNo });
      if (!patientDetails) {
        return res.status(404).json({ message: "Patient not found" });
      }
      const result = await Token.aggregate([
        { $match: { "tokens.patient": patientDetails._id } },
      ]);
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "No token found for patient" });
      }
      // filter tokens belonging to this patient then pick the latest one
      const patientTokens = result[0].tokens.filter(
        (t) => t.patient.toString() === patientDetails._id.toString()
      );
      const results1 = patientTokens[patientTokens.length - 1];

      const docsDetails = await Doc.findById(results1.docs);
      if (!docsDetails) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      const combinedData = await buildCombinedData(patientDetails);
      return res.status(200).json({
        data: buildResponseData(results1, docsDetails, patientDetails, combinedData),
      });

    } else {
      return res.status(400).json({ message: "Provide token id or patient phone number" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err });
  }
};

async function buildCombinedData(patientDetails) {
  const prescriptions = patientDetails.docConsult.map((e) => e.prescription);
  let doctorNames = [];
  const populated = await Pats.findById(patientDetails._id)
    .populate("docConsult.doctor")
    .exec();
  if (populated) {
    doctorNames = populated.docConsult.map((c) => c.doctor?.name || "Unknown");
  }
  return prescriptions.map((prescription, i) => ({
    prescription,
    doctorName: doctorNames[i],
  }));
}

function buildResponseData(tokenEntry, docsDetails, patientDetails, combinedData) {
  return {
    token: tokenEntry.token,
    docs: {
      _id: docsDetails._id,
      name: docsDetails.name,
      age: docsDetails.age,
    },
    patient: {
      _id: patientDetails._id,
      name: patientDetails.name,
      age: patientDetails.age,
      phno: patientDetails.phno,
      combinedData,
    },
    createdAt: tokenEntry.createdAt,
  };
}

module.exports = { retrieveSingleToken };