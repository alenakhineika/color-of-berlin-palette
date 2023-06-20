import { Router } from 'express';

const genericController = require('../controllers/generic');
const router = Router();

router.get('/', genericController.index);

router.get('/getRecentRecords', genericController.getRecentRecords);

router.get('/getRecentRecordsPerWeek', genericController.getRecentRecordsPerWeek);

router.get('/getAllData', genericController.getAllData);

router.get('/getLeaderboard', genericController.getLeaderboard);

module.exports = router;
