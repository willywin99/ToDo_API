const pool = require('../config/database');

const getAllItems = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const [items] = await pool.execute(
      `SELECT * FROM checklist_items 
       WHERE checklist_id = ? AND checklist_id IN 
       (SELECT id FROM checklists WHERE user_id = ?)`,
      [checklistId, req.userId]
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get items', error: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const { checklistId, itemId } = req.params;
    const [items] = await pool.execute(
      `SELECT * FROM checklist_items 
       WHERE id = ? AND checklist_id = ? AND checklist_id IN
       (SELECT id FROM checklists WHERE user_id = ?)`,
      [itemId, checklistId, req.userId]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get item', error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const { itemName } = req.body;
    
    const [result] = await pool.execute(
      `INSERT INTO checklist_items (checklist_id, item_name) 
       SELECT ?, ? FROM checklists 
       WHERE id = ? AND user_id = ?`,
      [checklistId, itemName, checklistId, req.userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Checklist not found' });
    }
    
    const [newItem] = await pool.execute(
      'SELECT * FROM checklist_items WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newItem[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { checklistId, itemId } = req.params;
    
    const [result] = await pool.execute(
      `UPDATE checklist_items 
       SET is_completed = NOT is_completed 
       WHERE id = ? AND checklist_id = ? AND checklist_id IN
       (SELECT id FROM checklists WHERE user_id = ?)`,
      [itemId, checklistId, req.userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const [updatedItem] = await pool.execute(
      'SELECT * FROM checklist_items WHERE id = ?',
      [itemId]
    );
    
    res.json(updatedItem[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item status', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { checklistId, itemId } = req.params;
    
    const [result] = await pool.execute(
      `DELETE FROM checklist_items 
       WHERE id = ? AND checklist_id = ? AND checklist_id IN
       (SELECT id FROM checklists WHERE user_id = ?)`,
      [itemId, checklistId, req.userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

const renameItem = async (req, res) => {
  try {
    const { checklistId, itemId } = req.params;
    const { itemName } = req.body;
    
    const [result] = await pool.execute(
      `UPDATE checklist_items 
       SET item_name = ? 
       WHERE id = ? AND checklist_id = ? AND checklist_id IN
       (SELECT id FROM checklists WHERE user_id = ?)`,
      [itemName, itemId, checklistId, req.userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const [updatedItem] = await pool.execute(
      'SELECT * FROM checklist_items WHERE id = ?',
      [itemId]
    );
    
    res.json(updatedItem[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to rename item', error: error.message });
  }
};

module.exports = { 
  getAllItems, 
  getItem,
  createItem,
  updateItemStatus,
  deleteItem,
  renameItem
};