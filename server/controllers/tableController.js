const db = require('../config/db');

const getTables = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM dining_tables ORDER BY table_no'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTable = async (req, res) => {
  const { tableNo } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO dining_tables (table_no) VALUES (?)',
      [tableNo]
    );
    res.status(201).json({ id: result.insertId, table_no: tableNo, status: 'empty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTables, addTable };
