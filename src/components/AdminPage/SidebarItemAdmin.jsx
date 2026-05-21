import styles from "./SidebarItemAdmin.module.css";
import { NavLink } from "react-router-dom";

function SidebarItemAdmin({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.item} ${isActive ? styles.active : ""}`
      }
      end={to === "/admin"}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default SidebarItemAdmin;
