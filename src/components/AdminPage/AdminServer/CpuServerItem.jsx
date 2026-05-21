import styles from "./CpuServerItem.module.css";
function CpuServerItem({ number, label, icon }) {
  const value = parseInt(number);

  let status = "";
  let color = "";

  switch (label) {
    case "RAM":
      if (value < 256) {
        status = "Normal";
        color = "#1fb0a2";
      } else if (value < 384) {
        status = "Moderado";
        color = "#f59e0b";
      } else {
        status = "Crítico";
        color = "#ef4444";
      }
      break;
    default:
      if (value < 50) {
        status = "Normal";
        color = "#1fb0a2";
      } else if (value < 80) {
        status = "Moderado";
        color = "#f59e0b";
      } else {
        status = "Crítico";
        color = "#ef4444";
      }
      break;
  }




  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.info}>
            <span className={styles.label}>{label}</span>
            <span className={styles.status} style={{ color }}>
              {status}
            </span>
          </div>
        </div>
        <h2 className={styles.number}>{number}</h2>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: (label === "RAM") ? `${((value / 512) * 100).toFixed(1)}%` : `${value}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}

export default CpuServerItem;
