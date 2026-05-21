import styles from "../../components/AdminPage/AdminMainPage.module.css";
import SidebarAdmin from "../../components/AdminPage/SidebarAdmin";
import AdminHeader from "../../components/AdminPage/AdminHeader";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "../../hooks/isMobile";
import { useState } from "react";

function AdminMainPage() {
  const isMobile = useIsMobile(1060);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.page}>
      {isMobile && sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <SidebarAdmin isMobile={isMobile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.mainSection}>
        <AdminHeader isMobile={isMobile} onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminMainPage;