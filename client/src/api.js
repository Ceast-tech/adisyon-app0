const API = "/api";

export async function getTables() {
  const res = await fetch(`${API}/tables`);
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API}/categories`);
  return res.json();
}

export async function getProducts(categoryId) {
  const res = await fetch(`${API}/products?categoryId=${categoryId}`);
  return res.json();
}

export async function addProductToOrder(tableId, productId) {
  const res = await fetch(`${API}/orders/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, productId, quantity: 1 }),
  });
  return res.json();
}

export async function getTableOrder(tableId) {
  const res = await fetch(`${API}/tables/${tableId}/order`);
  return res.json();
}

export async function closeOrder(orderId) {
  const res = await fetch(`${API}/orders/${orderId}/close`, {
    method: "POST",
  });
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API}/orders`);
  return res.json();
}

export async function getDailyReport() {
  const res = await fetch(`${API}/reports/daily`);
  return res.json();
}

// Adisyondaki tek bir ürünü/kalemi siler
export async function deleteOrderItem(itemId) {
  const res = await fetch(`${API}/orders/items/${itemId}`, {
    method: "DELETE",
  });

  return res.json();
}
