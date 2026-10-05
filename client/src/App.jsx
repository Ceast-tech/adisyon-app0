import { useEffect, useState, useCallback } from "react";
import TablesPanel from "./components/TablesPanel.jsx";
import MenuPanel from "./components/MenuPanel.jsx";
import OrderPanel from "./components/OrderPanel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import ReportModal from "./components/ReportModal.jsx";
import * as api from "./api.js";

export default function App() {
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [order, setOrder] = useState(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(false);

  const refreshTables = useCallback(async () => {
    setTables(await api.getTables());
  }, []);

  const refreshHistory = useCallback(async () => {
    setOrders(await api.getOrders());
  }, []);

  const refreshOrder = useCallback(async (tableId) => {
    if (!tableId) {
      setOrder(null);
      return;
    }

    setOrder(await api.getTableOrder(tableId));
  }, []);

  // İlk açılış: masaları, kategorileri ve adisyon geçmişini yükle
  useEffect(() => {
    refreshTables();
    refreshHistory();
    api.getCategories().then(setCategories);
  }, [refreshTables, refreshHistory]);

  const handleSelectTable = async (tableId) => {
    setSelectedTableId(tableId);
    setProducts([]);
    await refreshOrder(tableId);
  };

  const handleSelectCategory = async (categoryId) => {
    setProducts(await api.getProducts(categoryId));
  };

  const handleAddProduct = async (productId) => {
    if (!selectedTableId) return;

    await api.addProductToOrder(selectedTableId, productId);

    await Promise.all([
      refreshTables(),
      refreshOrder(selectedTableId),
      refreshHistory(),
    ]);
  };

  const handleCloseOrder = async (orderId) => {
    await api.closeOrder(orderId);

    await Promise.all([
      refreshTables(),
      refreshOrder(selectedTableId),
      refreshHistory(),
    ]);
  };

  // Adisyondan tek bir ürün/kalem siler
  const handleDeleteOrderItem = async (itemId) => {
    await api.deleteOrderItem(itemId);

    await Promise.all([refreshOrder(selectedTableId), refreshHistory()]);
  };

  const handleOpenReport = async () => {
    setReportOpen(true);
    setReportLoading(true);
    setReportError(false);

    try {
      setReport(await api.getDailyReport());
    } catch {
      setReportError(true);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <TablesPanel
        tables={tables}
        selectedTableId={selectedTableId}
        onSelectTable={handleSelectTable}
        onOpenReport={handleOpenReport}
      />

      <MenuPanel
        categories={categories}
        products={products}
        onSelectCategory={handleSelectCategory}
        onAddProduct={handleAddProduct}
      />

      <OrderPanel
        selectedTableId={selectedTableId}
        order={order}
        onCloseOrder={handleCloseOrder}
        deleteOrder={handleDeleteOrderItem}
      />

      <HistoryPanel orders={orders} />

      {reportOpen && (
        <ReportModal
          report={report}
          loading={reportLoading}
          error={reportError}
          onClose={() => setReportOpen(false)}
        />
      )}
    </>
  );
}
