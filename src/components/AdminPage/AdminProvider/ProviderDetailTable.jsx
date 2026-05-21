import styles from "./ProviderDetailTable.module.css";

const VOICE_RATE = 0.013;
const VIDEO_RATE = 0.015;
const SMS_RATE = 0.0075;

function ProviderDetailTable({ metrics = [] }) {
  const data = metrics.map((m) => ({
    fecha: m.date,
    voz: m.voiceMinutes,
    video: m.videoMinutes,
    sms: m.smsCount,
    costo: (
      m.voiceMinutes * VOICE_RATE +
      m.videoMinutes * VIDEO_RATE +
      m.smsCount * SMS_RATE
    ),
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Detalle por Día</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Fecha</th>
            <th className={`${styles.th} ${styles.right}`}>Voz (min)</th>
            <th className={`${styles.th} ${styles.right}`}>Video (min)</th>
            <th className={`${styles.th} ${styles.right}`}>SMS</th>
            <th className={`${styles.th} ${styles.right}`}>Costo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.fecha} className={styles.row}>
              <td className={styles.td}>{row.fecha}</td>
              <td className={`${styles.td} ${styles.right}`}>
                {row.voz.toFixed(1)}
              </td>
              <td className={`${styles.td} ${styles.right}`}>
                {row.video.toFixed(1)}
              </td>
              <td className={`${styles.td} ${styles.right}`}>
                {row.sms.toLocaleString()}
              </td>
              <td className={`${styles.td} ${styles.right} ${styles.costo}`}>
                ${row.costo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProviderDetailTable;