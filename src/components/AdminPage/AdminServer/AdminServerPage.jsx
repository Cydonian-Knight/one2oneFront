import { useEffect, useState } from "react";
import styles from "./AdminServerPage.module.css";
import CpuServer from "./CpuServer";
import WiFiServer from "./WiFiServer";
import ResourceChart from "./ResourceChart";

const HISTORY_URL = "https://one2onebackend.onrender.com/api/admin/metrics/history24";

function AdminServerPage() {
  const [monitorData, setMonitorData] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(HISTORY_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => {
        const mapped = body.data.metrics.map((m) => ({
          time: new Date(m.timestamp).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cpu: parseFloat(m.cpu),
          ram: parseFloat(m.ram.heapUsed),
          disco: parseFloat(m.disk),
          redEntrada: parseFloat(m.network.in),
          redSalida: parseFloat(m.network.out),
        }));
        setMonitorData(mapped);
        setCurrent(mapped.at(-1) ?? null);
      })
      .catch((err) => console.error("❌ Server stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Recursos del Servidor</h2>
        <span>Monitoreo en tiempo real del sistema</span>
      </div>
      <div className={styles.content}>
        <CpuServer current={current} loading={loading} />
        <WiFiServer current={current} loading={loading} />

        <div className={styles.graphs}>
          <ResourceChart
            title="CPU — Últimas 24h"
            data={monitorData}
            dataKey="cpu"
            color="#14b8a6"
            unit="%"
          />
          <ResourceChart
            title="RAM — Últimas 24h"
            data={monitorData}
            dataKey="ram"
            color="#6366f1"
            unit=" MB"
          />
          <ResourceChart
            title="Disco — Últimas 24h"
            data={monitorData}
            dataKey="disco"
            color="#f97316"
            unit="%"
          />
          <ResourceChart
            title="Tráfico de Red — Últimas 24h"
            data={monitorData}
            series={[
              { dataKey: "redEntrada", color: "#14b8a6" },
              { dataKey: "redSalida", color: "#6366f1" },
            ]}
            unit=" MB/s"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminServerPage;