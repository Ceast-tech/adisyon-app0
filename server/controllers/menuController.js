const db = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE category_id = ?',
      [categoryId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCategories, getProducts };
