import styles from "./CallLog.module.css";
import { Phone, Video, Clock, PhoneMissed } from "lucide-react";

const TYPE_CONFIG = {
  Audio: { icon: <Phone size={15} />, className: "badgeAudio" },
  Video: { icon: <Video size={15} />, className: "badgeVideo" },
};

function CallLog({ data = [], loading }) {
  if (loading) return <p style={{ padding: 20, color: "#94a3b8" }}>Cargando llamadas...</p>;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Llamante</th>
            <th className={styles.th}>Receptor</th>
            <th className={styles.th}>Tipo</th>
            <th className={styles.th}>Duración</th>
            <th className={styles.th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const config = TYPE_CONFIG[row.tipo];
            return (
              <tr key={row.id} className={styles.row}>
                <td className={`${styles.td} ${styles.idCell}`}>{row.id}</td>
                <td className={`${styles.td} ${styles.bold}`}>{row.llamante}</td>
                <td className={`${styles.td} ${styles.muted}`}>{row.receptor}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles[config.className]}`}>
                    {config.icon}
                    {row.tipo}
                  </span>
                </td>
                <td className={styles.td}>
                  {row.duracion ? (
                    <span className={styles.duracion}>
                      <Clock size={15} />
                      {row.duracion}
                    </span>
                  ) : (
                    <span className={styles.duracion}>
                      <PhoneMissed size={15} color="red" />
                      <span className={styles.perdida}>Perdida</span>
                    </span>
                  )}
                </td>
                <td className={`${styles.td} ${styles.muted}`}>{row.fecha}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CallLog;