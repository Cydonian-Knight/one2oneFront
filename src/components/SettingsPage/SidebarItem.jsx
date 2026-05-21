import styles from "./SidebarItem.module.css";
import { NavLink } from "react-router-dom";

function SidebarItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.item} ${isActive ? styles.active : ""}`
      }
      end={to === "/chat/settings"}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default SidebarItem;
