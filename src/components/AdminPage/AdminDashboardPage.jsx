import { useEffect, useState } from "react";
import styles from "./AdminDashboardPage.module.css";
import GenStats from "./GenStats";
import RamStats from "./RamStats";
import SentStats from "./SentStats";
import ServerResourcesGraph from "./ServerResourcesGraph";
import ProviderConsumptionChart from "./ProviderConsumptionChart";

const HISTORY_SIZE = 576;
const SSE_URL = "https://one2onebackend.onrender.com/api/admin/metrics/stream";
const STATS_URL = "https://one2onebackend.onrender.com/api/admin/stats";
const PROVIDER_URL = "https://one2onebackend.onrender.com/api/admin/provider-metrics";

function AdminDashboardPage() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [stats, setStats] = useState(null);
  const [providerMetrics, setProviderMetrics] = useState([]);

  useEffect(() => {
    fetch(STATS_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => setStats(body.data))
      .catch((err) => console.error("❌ Stats error:", err));
  }, []);

  useEffect(() => {
    fetch(PROVIDER_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => setProviderMetrics(body.data.metrics))
      .catch((err) => console.error("❌ Provider metrics error:", err));
  }, []);

  useEffect(() => {
    let source = null;
    let active = true;

    function connect() {
      if (!active) return;
      source = new EventSource(SSE_URL, { withCredentials: true });

      source.onmessage = (e) => {
        if (!active) return;
        const data = JSON.parse(e.data);

        if (data.history) {
          setHistory(data.history);
          setCurrent(data.history.at(-1) ?? null);
          return;
        }

        if (data.type === "live") {
          setCurrent((prev) =>
            prev ? { ...prev, ...data, ram: { ...prev.ram, ...data.ram } } : data
          );
          return;
        }

        setCurrent(data);
        setHistory((prev) => [...prev.slice(-(HISTORY_SIZE - 1)), data]);
      };

      source.onerror = () => {
        if (source.readyState === EventSource.CLOSED) {
          source.close();
          setTimeout(connect, 3000);
        }
      };
    }

    connect();
    return () => { active = false; source?.close(); };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Dashboard</h2>
        <span>Resumen general del sistema One2One</span>
      </div>
      <div className={styles.content}>
        <GenStats current={current} stats={stats} />
        <RamStats current={current} />
        <SentStats stats={stats} />
        <div className={styles.chartSection}>
          <ServerResourcesGraph history={history} />
          <ProviderConsumptionChart
            title="Consumo del Proveedor (7 días)"
            metrics={providerMetrics}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;