import { useRef, useState } from "react";
import SidebarItemAdmin from "./SidebarItemAdmin";
import styles from "./SidebarAdmin.module.css";
import {
  LayoutDashboard, Server, CreditCard, Flag,
  Users, PhoneCall, Shield, LogOut,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function SidebarAdmin({ isMobile, isOpen, onClose }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();


  async function handleLogout() {
    await fetch("https://one2onebackend.onrender.com/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      });
    navigate("/auth");
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = [
    { label: "Dashboard", icon: <LayoutDashboard size={15} />, path: "/admin" },
    { label: "Recursos del Servidor", icon: <Server size={15} />, path: "/admin/server" },
    { label: "Consumo proveedor", icon: <CreditCard size={15} />, path: "/admin/provider" },
    { label: "Reportes", icon: <Flag size={15} />, path: "/admin/reports" },
    { label: "Gestión de usuarios", icon: <Users size={15} />, path: "/admin/users" },
    { label: "Logs de llamadas", icon: <PhoneCall size={15} />, path: "/admin/logs" },
  ];

  const admin = {
    avatar: "https://i.pinimg.com/736x/c6/ae/c8/c6aec832cafbde896ea6727862790913.jpg",
    username: "tay_dev",
  };

  return (
    <div className={`${styles.container} ${isMobile ? styles.containerMobile : ""} ${isMobile && isOpen ? styles.containerOpen : ""}`}>

      {/* Botón X para cerrar en mobile */}
      {!isMobile && (
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      )}

      <div className={styles.infoContainer}>
        <div className={styles.shield}>
          <Shield size={19} color="white" />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>One2One</h3>
          <span className={styles.title2}>Admin Panel</span>
        </div>
      </div>

      <span className={styles.menu}>MENÚ</span>

      {items.map((item) => (
        <SidebarItemAdmin
          key={item.label}
          label={item.label}
          icon={item.icon}
          to={item.path}
        />
      ))}

      <div className={styles.adminContainer}
        onClick={() => setShowMenu(!showMenu)}
        ref={menuRef}>
        <img
          src={admin.avatar}
          alt=""
          className={styles.adminAvatar}
        />
        <div className={styles.adminInfo}>
          <span className={styles.adminUsr}>{admin.username}</span>
          <span className={styles.adminSub}>Administrador</span>
        </div>

        {showMenu && (
          <div className={styles.adminMenu}>
            <button
              className={styles.adminMenuItem}
              onClick={() => {
                // tu lógica de logout aquí
                setShowMenu(false);
                handleLogout();
              }}
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>

  );
}

export default SidebarAdmin;