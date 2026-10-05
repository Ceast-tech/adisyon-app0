const db = require('../config/db');

// Bugün kapanan adisyonların brüt cirosu ve adisyon sayısı
const getDailyReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         COUNT(DISTINCT o.id) AS order_count,
         COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS gross_revenue
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.status = 'closed' AND DATE(o.closed_at) = CURDATE()`
    );

    res.json({
      orderCount: rows[0].order_count,
      grossRevenue: Number(rows[0].gross_revenue),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDailyReport };
