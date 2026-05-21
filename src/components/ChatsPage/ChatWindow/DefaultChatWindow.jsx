import styles from "./DefaultChatWindow.module.css";
import { MessageSquare } from "lucide-react";
function DefaultChatWindow() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <MessageSquare size={50} color="#248f84" />
        </div>
        <div className={styles.text}>
          <h3>Selecciona un chat para comenzar</h3>
          <span>
            Envía mensajes, comparte archivos, realiza llamadas de voz y
            videollamadas con tus contactos
          </span>
        </div>
      </div>
    </div>
  );
}

export default DefaultChatWindow;
