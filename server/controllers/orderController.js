const db = require("../config/db");

// Masaya boş bir adisyon açar
const openOrder = async (req, res) => {
  const { tableId } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT id FROM orders WHERE table_id = ? AND status = 'open'",
      [tableId],
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: "Table already has an open order" });
    }

    const [result] = await connection.query(
      "INSERT INTO orders (table_id) VALUES (?)",
      [tableId],
    );

    await connection.query(
      "UPDATE dining_tables SET status = 'occupied' WHERE id = ?",
      [tableId],
    );

    await connection.commit();
    res.status(201).json({ orderId: result.insertId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Masaya ürün ekler (açık adisyon yoksa önce adisyon açar)
const addItemToOrder = async (req, res) => {
  const { tableId, productId, quantity } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      "SELECT id FROM orders WHERE table_id = ? AND status = 'open'",
      [tableId],
    );

    let orderId;
    if (orders.length > 0) {
      orderId = orders[0].id;
    } else {
      const [result] = await connection.query(
        "INSERT INTO orders (table_id) VALUES (?)",
        [tableId],
      );
      orderId = result.insertId;

      await connection.query(
        "UPDATE dining_tables SET status = 'occupied' WHERE id = ?",
        [tableId],
      );
    }

    const [products] = await connection.query(
      "SELECT price FROM products WHERE id = ?",
      [productId],
    );

    if (products.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Product not found" });
    }

    await connection.query(
      "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
      [orderId, productId, quantity, products[0].price],
    );

    await connection.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Bir masanın açık adisyonunu kalemleri ve toplamıyla getirir
const getTableOrder = async (req, res) => {
  const { tableId } = req.params;

  try {
    const [orders] = await db.query(
      "SELECT id FROM orders WHERE table_id = ? AND status = 'open'",
      [tableId],
    );

    if (orders.length === 0) {
      return res.json({ orderId: null, items: [], total: 0 });
    }

    const orderId = orders[0].id;

    const [items] = await db.query(
      `SELECT oi.id, p.name, oi.quantity, oi.unit_price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId],
    );

    const total = items.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0,
    );

    res.json({ orderId, items, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adisyonu kapatır, masayı boşaltır
const closeOrder = async (req, res) => {
  const { orderId } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      "SELECT table_id FROM orders WHERE id = ? AND status = 'open'",
      [orderId],
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Open order not found" });
    }

    await connection.query(
      "UPDATE orders SET status = 'closed', closed_at = NOW() WHERE id = ?",
      [orderId],
    );

    await connection.query(
      "UPDATE dining_tables SET status = 'empty' WHERE id = ?",
      [orders[0].table_id],
    );

    await connection.commit();
    res.json({ message: "Order closed" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

// Tüm adisyonları (açık + kapalı) kalemleri ve toplamıyla getirir
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.id, dt.table_no, o.status, o.opened_at, o.closed_at
      FROM orders o
      JOIN dining_tables dt ON dt.id = o.table_id
      ORDER BY o.id DESC
    `);

    const [items] = await db.query(`
      SELECT oi.order_id, p.name, oi.quantity, oi.unit_price
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
    `);

    const result = orders.map((order) => {
      const orderItems = items.filter((item) => item.order_id === order.id);
      const total = orderItems.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0,
      );
      return { ...order, items: orderItems, total };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrderItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const [result] = await db.query("DELETE FROM order_items WHERE id = ?", [
      itemId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Order item not found",
      });
    }

    res.json({
      message: "Order item deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  openOrder,
  addItemToOrder,
  getTableOrder,
  closeOrder,
  getOrders,
  deleteOrderItem,
};
