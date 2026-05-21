import { useEffect, useState } from "react";
import styles from "./AdminProviderPage.module.css";
import ProviderStats from "./ProviderStats";
import ProviderConsChart from "./ProviderConsChart";
import CostProviderGraph from "./CostProviderGraph";
import ProviderDetailTable from "./ProviderDetailTable";

const PROVIDER_URL = "https://one2onebackend.onrender.com/api/admin/provider-metrics";

function AdminProviderPage() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(PROVIDER_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => setMetrics(body.data.metrics))
      .catch((err) => console.error("❌ Provider metrics error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Consumo del Proveedor</h2>
        <span>Minutos de voz, video y SMS consumidos</span>
      </div>
      <div className={styles.content}>
        <ProviderStats metrics={metrics} loading={loading} />
        <div className={styles.graphs}>
          <ProviderConsChart metrics={metrics} loading={loading} />
          <CostProviderGraph metrics={metrics} loading={loading} />
        </div>
        <ProviderDetailTable metrics={metrics} loading={loading} />
      </div>
    </div>
  );
}

export default AdminProviderPage;