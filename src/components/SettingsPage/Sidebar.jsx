import SidebarItem from "./SidebarItem";
import styles from "./Sidebar.module.css";
import { User, Settings, Ban, HandCoins } from "lucide-react";

function Sidebar() {
  const items = [
    {
      label: "Perfil",
      icon: <User size={15} />,
      path: "/chat/settings",
    },
    {
      label: "Cuenta",
      icon: <Settings size={15} />,
      path: "/chat/settings/account",
    },
    /* {
      label: "Bloqueos",
      icon: <Ban size={15} />,
      path: "/chat/settings/blocked",
    }, */
    {
      label: "Pagos",
      icon: <HandCoins size={15} />,
      path: "/chat/settings/payment",
    },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <SidebarItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          to={item.path}
        />
      ))}
    </div>
  );
}

export default Sidebar;
