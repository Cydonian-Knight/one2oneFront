import background from "../../assets/auth-bg.jpg";
import styles from "./LeftPanel.module.css";
import { MessageCircle } from "lucide-react";

function LeftPanel() {
  return (
    <div className={styles.container}>
      <img src={background} alt="" />
      <div className={styles.overlay}>
        <div className={styles.logoContainer}>
          <MessageCircle size={30} color="white" />
        </div>
        <h1>One2One</h1>
        <p>
          Mensajería privada, segura y elegante. Conecta con las personas que
          importan.
        </p>
      </div>
    </div>
  );
}

export default LeftPanel;
