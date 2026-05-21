import styles from "./SecurityCard.module.css";

function SecurityCard({ icon, title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}

export default SecurityCard;
