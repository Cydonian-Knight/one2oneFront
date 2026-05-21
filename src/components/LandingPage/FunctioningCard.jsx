import styles from "./FunctioningCard.module.css";
function FunctioningCard({ icon, title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <div className={styles.iconInner}>{icon}</div>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export default FunctioningCard;
