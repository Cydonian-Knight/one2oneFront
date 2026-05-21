import styles from "./RamStatsItem.module.css";
function RamStatsItem({ number, label, icon }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span>{label}</span>
        <h2>{number}</h2>
      </div>
      <div className={styles.right}>{icon}</div>
    </div>
  );
}

export default RamStatsItem;
