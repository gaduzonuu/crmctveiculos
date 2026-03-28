const express = require('express');
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', leadController.getLeads);
router.get('/:id', leadController.getLeadById);
router.get('/:phone/messages', leadController.getLeadMessages);

module.exports = router;
