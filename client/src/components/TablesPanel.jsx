export default function TablesPanel({ tables, selectedTableId, onSelectTable, onOpenReport }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Masalar</h2>
        <button className="settings-btn" onClick={onOpenReport} title="Gün Sonu Raporu">
          ⚙️
        </button>
      </div>
      <div className="row">
        {tables.map((table) => (
          <button
            key={table.id}
            className={`${table.status} ${table.id === selectedTableId ? 'selected' : ''}`}
            onClick={() => onSelectTable(table.id)}
          >
            Masa {table.table_no}
          </button>
        ))}
      </div>
    </div>
  );
}
