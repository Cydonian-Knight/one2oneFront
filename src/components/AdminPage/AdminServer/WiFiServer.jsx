import { Wifi } from "lucide-react";
import styles from "./WiFiServer.module.css";

function WiFiServer({ current, loading }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Wifi size={25} color="#1dafa1" />
      </div>
      <div className={styles.left}>
        <span className={styles.label}>Entrada</span>
        <div className={styles.wifiStats}>
          <h2>{loading || !current ? "—" : current.redEntrada}</h2>
          <span>MB/s</span>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.label}>Salida</span>
        <div className={styles.wifiStats}>
          <h2>{loading || !current ? "—" : current.redSalida}</h2>
          <span>MB/s</span>
        </div>
      </div>
    </div>
  );
}

export default WiFiServer;