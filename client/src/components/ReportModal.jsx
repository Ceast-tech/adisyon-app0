export default function ReportModal({ report, loading, error, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>Gün Sonu Raporu</h3>
          <span className="close-btn" onClick={onClose}>&times;</span>
        </div>

        {loading && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Yükleniyor...</p>
        )}

        {error && (
          <p style={{ color: '#721c24', textAlign: 'center' }}>Rapor yüklenirken hata oluştu.</p>
        )}

        {!loading && !error && report && (
          <div className="report-list">
            <div className="report-item total">
              <span>Bugünkü Ciro</span>
              <span>{Number(report.grossRevenue ?? 0).toFixed(2)} ₺</span>
            </div>
            <div className="report-item">
              <span>🧾 Çek/Adisyon Sayısı</span>
              <span>{report.orderCount ?? 0} Adet</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
