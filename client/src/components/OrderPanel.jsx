export default function OrderPanel({
  selectedTableId,
  order,
  onCloseOrder,
  deleteOrder,
}) {
  if (!selectedTableId) {
    return (
      <div className="panel">
        <h2>Adisyon</h2>

        <div id="order">
          <p>Bir masa seçin.</p>
        </div>
      </div>
    );
  }

  if (!order || order.items.length === 0) {
    return (
      <div className="panel">
        <h2>Adisyon</h2>

        <div id="order">
          <p>Bu masada açık adisyon yok.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Adisyon</h2>

      <div id="order">
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.quantity} x {item.name}
              </span>

              <span>{item.unit_price} ₺</span>

              <button
                className="delete-button"
                onClick={() => deleteOrder(item.id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        <strong>
          <span>Toplam</span>
          <span>{order.total.toFixed(2)} ₺</span>
        </strong>

        <button
          style={{
            marginTop: 12,
            backgroundColor: "var(--primary)",
            color: "white",
          }}
          onClick={() => onCloseOrder(order.orderId)}
        >
          Adisyonu Kapat
        </button>
      </div>
    </div>
  );
}
