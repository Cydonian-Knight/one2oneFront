import styles from "./UserSettingsModal.module.css";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";

function UserSettingsModal() {
  const navigate = useNavigate();

  function handleSettings() {
    navigate("/chat/settings");
  }

  async function handleLogout() {
    await fetch("https://one2onebackend.onrender.com/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      });
    navigate("/auth");
  }

  return (
    <div className={styles.container}>
      <div className={styles.item} onClick={handleSettings}>
        <Settings size={15} />
        Configuración
      </div>
      <div className={styles.line} />
      <div className={styles.logout} onClick={handleLogout}>
        <LogOut size={15} />
        Cerrar sesión
      </div>
    </div>
  );
}

export default UserSettingsModal;