import styles from "./StatusDot.module.css";
function StatusDot({
  isOnline,
  size = 10,
  bottom = 0,
  right = 0,
  isBlocked = false,
}) {
  return (
    <span
      className={`${styles.status} ${isOnline ? styles.online : styles.offline}
      ${isBlocked ? styles.blocked : ""}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        bottom: `${bottom}px`,
        right: `${right}px`,
      }}
    />
  );
}

export default StatusDot;
