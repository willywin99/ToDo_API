const pool = require('../config/database');

const getAllChecklists = async (req, res) => {
  try {
    const [checklists] = await pool.execute(
      'SELECT * FROM checklists WHERE user_id = ?',
      [req.userId]
    );
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get checklists' });
  }
};

const createChecklist = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO checklists (user_id, name) VALUES (?, ?)',
      [req.userId, name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checklist' });
  }
};

const deleteChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;
    await pool.execute(
      'DELETE FROM checklists WHERE id = ? AND user_id = ?',
      [checklistId, req.userId]
    );
    res.json({ message: 'Checklist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete checklist' });
  }
};

module.exports = { getAllChecklists, createChecklist, deleteChecklist };