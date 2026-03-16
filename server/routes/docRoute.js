const router = require('express').Router();
const { DoclogController } = require('../controllers/DoclogController');
const { createDoc } = require('../controllers/createDoc');
const { docDataReader } = require('../controllers/docDataReader');
const { enquirePatController } = require('../controllers/enquirePatController');
const { markTokenChecked } = require('../controllers/markTokenChecked');
const { retrieveSingleToken } = require('../controllers/retrieveSingleToken');
const { getTokensForToday } = require('../controllers/retrieveToken');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/logdoc',DoclogController)
router.post('/createdoc',createDoc);
router.post('/enqpat',verifyToken,enquirePatController);
router.post('/marktoken',verifyToken,markTokenChecked);
router.post('/retdoc',verifyToken,docDataReader);
router.post('/retalltoken',verifyToken,getTokensForToday);
router.post('/rettoken',verifyToken,retrieveSingleToken);
module.exports = router;