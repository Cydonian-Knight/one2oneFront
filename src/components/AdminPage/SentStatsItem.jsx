import styles from "./SentStatsItem.module.css";
function SentStatsItem({ number, label, icon, bgColor }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon} style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <div className={styles.info}>
        <h3>{number}</h3>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default SentStatsItem;
