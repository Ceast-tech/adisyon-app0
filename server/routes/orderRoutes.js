const express = require("express");
const router = express.Router();
const {
  openOrder,
  addItemToOrder,
  getTableOrder,
  closeOrder,
  getOrders,
  deleteOrderItem,
} = require("../controllers/orderController");

router.get("/orders", getOrders);
router.post("/orders", openOrder);
router.post("/orders/items", addItemToOrder);
router.post("/orders/:orderId/close", closeOrder);
router.get("/tables/:tableId/order", getTableOrder);
router.delete("/orders/items/:itemId", deleteOrderItem);
module.exports = router;
