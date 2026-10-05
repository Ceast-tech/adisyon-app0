function formatTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryPanel({ orders }) {
  return (
    <div className="panel">
      <h2>Adisyon Geçmişi</h2>
      <div id="history">
        {orders.length === 0 && <p>Henüz adisyon yok.</p>}
        {orders.map((order) => (
          <div key={order.id} className={`history-card ${order.status}`}>
            <div className="head">
              <span>Masa {order.table_no} - {order.status === 'open' ? 'Açık' : 'Kapalı'}</span>
              <span>{order.total.toFixed(2)} ₺</span>
            </div>
            <div>{order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}</div>
            <div className="time">
              Açılış: {formatTime(order.opened_at)} - Kapanış: {formatTime(order.closed_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
