import { useEffect, useState } from "react";
import styles from "./AdminCallLogPage.module.css";
import CallLog from "./CallLog";

const CALL_LOGS_URL = "https://one2onebackend.onrender.com/api/admin/call-logs";

function AdminCallLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(CALL_LOGS_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => setLogs(body.data.logs))
      .catch((err) => console.error("❌ Call logs error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Logs de Llamadas</h2>
        <span>Historial completo de llamadas del sistema</span>
      </div>
      <div className={styles.content}>
        <CallLog data={logs} loading={loading} />
        <div className={styles.graphs}></div>
      </div>
    </div>
  );
}

export default AdminCallLogPage;