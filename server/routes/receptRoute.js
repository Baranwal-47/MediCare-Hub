const { createToken } = require('../controllers/addToken');
const { createRecept } = require('../controllers/createRecept');
const { receptRegister } = require('../controllers/receptRegister');
const { receptDataReader } = require('../controllers/receptDataReader');
const { ReceptlogController } = require('../controllers/ReceptlogController');
const { retrievePatientDetails } = require('../controllers/retrievePatientDetails');
const { billingAmount } = require('../controllers/billingAmount');
const { verifyToken } = require('../middleware/verifyToken');

const router = require('express').Router();

router.post("/createrecept",createRecept);
router.post("/logrecept",ReceptlogController);
router.post("/createtoken",verifyToken,createToken);
router.post("/receptregister",verifyToken,receptRegister);
router.post("/retrecept",verifyToken,receptDataReader);
router.post("/retrpat",verifyToken,retrievePatientDetails);
router.post("/bill",verifyToken,billingAmount);

module.exports = router;