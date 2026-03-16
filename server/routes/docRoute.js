const router = require('express').Router();
const { DoclogController } = require('../controllers/DoclogController');
const { createDoc } = require('../controllers/createDoc');
const { docDataReader } = require('../controllers/docDataReader');
const { enquirePatController } = require('../controllers/enquirePatController');
const { retrieveSingleToken } = require('../controllers/retrieveSingleToken');
const { getTokensForToday } = require('../controllers/retrieveToken');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/logdoc',DoclogController)
router.post('/createdoc',createDoc);
router.post('/enqpat',verifyToken,enquirePatController);
router.post('/retdoc',verifyToken,docDataReader);
router.post('/retalltoken',verifyToken,getTokensForToday);
router.post('/rettoken',verifyToken,retrieveSingleToken);
module.exports = router;