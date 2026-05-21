import styles from "./GenStatsItem.module.css";
function GenStatsItem({ icon, number, label, valueIcon, value }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.icon}>{icon}</div>
        <h3>{number}</h3>
        <span>{label}</span>
      </div>
      <div className={styles.right}>
        <span>{valueIcon}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

export default GenStatsItem;
