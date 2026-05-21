import styles from "./UserHeader.module.css";
import StatusDot from "../StatusDot";
import { div, p } from "framer-motion/client";
import { Crown } from "lucide-react";

const formatChatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

  if (isSameDay(date, today)) {
    return "hoy a las: " + date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  if (isSameDay(date, yesterday)) {
    return "ayer a las: " + date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  if (diffDays < 7) {
    return "el " + date.toLocaleDateString("es-MX", { weekday: "long" }) + " a las: " + date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" });
};



function UserHeader({ user, onClick }) {
  console.log("holaa", user)
  return (
    <div className={styles.header} onClick={onClick}>
      <div className={styles.avatarContainer}>


        <img className={styles.avatar} src={user.avatar || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} alt="" />
        <StatusDot isOnline={(user.isBlocked || user.blockedYou) ? false : user.isOnline || false} />
      </div>

      <div className={styles.userInfo}>
        <div className={styles.nameRow}>
          <p className=
            {styles.username}>{user.username}

          </p>
          <span className={styles.statusText}>
            {(user.isBlocked || user.blockedYou) ? "Sin Informacion"
              : user.isOnline ? "En línea" : "Ultimo visto " + formatChatDate(user.lastSeenAt)}
          </span>
        </div>
      </div>
      {
        user?.subscriptionExpiresAt
        &&
        <div className={styles.premium}><Crown size={24} color="white" /></div>
      }
    </div>
  );
}

export default UserHeader;
