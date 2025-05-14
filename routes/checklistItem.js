const express = require('express');
const router = express.Router();
const checklistItemController = require('../controllers/checklistItemController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all items for a checklist
router.get('/:checklistId/items', checklistItemController.getAllItems);

// Create new item in checklist
router.post('/:checklistId/items', checklistItemController.createItem);

// Get specific item
router.get('/:checklistId/items/:itemId', checklistItemController.getItem);

// Update item status
router.put('/:checklistId/items/:itemId/status', checklistItemController.updateItemStatus);

// Delete item
router.delete('/:checklistId/items/:itemId', checklistItemController.deleteItem);

// Rename item
router.put('/:checklistId/items/:itemId/rename', checklistItemController.renameItem);

module.exports = router;