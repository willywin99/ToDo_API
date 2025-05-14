const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', checklistController.getAllChecklists);
router.post('/', checklistController.createChecklist);
router.delete('/:checklistId', checklistController.deleteChecklist);

module.exports = router;