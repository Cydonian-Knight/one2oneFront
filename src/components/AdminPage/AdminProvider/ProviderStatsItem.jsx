import styles from "./ProviderStatsItem.module.css";
function ProviderStatsItem({ icon, number, label, valueIcon, value }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.icon}>{icon}</div>
      </div>
      <div className={styles.right}>
        <h3>{number}</h3>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default ProviderStatsItem;
