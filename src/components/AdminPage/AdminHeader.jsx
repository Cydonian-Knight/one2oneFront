import styles from "./AdminHeader.module.css";
import { PanelLeft } from "lucide-react";

function AdminHeader({ isMobile, onMenuClick }) {
  return (
    <div className={styles.container}>
      {isMobile && (
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <PanelLeft size={22} />
        </button>
      )}
      Panel de Administración
    </div>
  );
}

export default AdminHeader;