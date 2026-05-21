import { useEffect, useState } from "react";
import styles from "./AdminReportsPage.module.css";
import ReportsTable from "./ReportsTable";

const REPORTS_URL = "https://one2onebackend.onrender.com/api/admin/reports";

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    fetch(REPORTS_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => setReports(body.data.reports))
      .catch((err) => console.error("❌ Reports error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleResolve = async (id) => {
    await fetch(`${REPORTS_URL}/${id}/resolve`, {
      method: "POST",
      credentials: "include",
    });
    fetchReports();
  };

  const handleDismiss = async (id) => {
    await fetch(`${REPORTS_URL}/${id}/dismiss`, {
      method: "POST",
      credentials: "include",
    });
    fetchReports();
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Reportes de Usuarios</h2>
        <span>Gestiona los reportes de contenido</span>
      </div>
      <div className={styles.content}>
        <ReportsTable
          data={reports}
          loading={loading}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
        />
        <div className={styles.graphs}></div>
      </div>
    </div>
  );
}

export default AdminReportsPage;