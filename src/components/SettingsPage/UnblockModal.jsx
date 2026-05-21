import styles from "./UnblockModal.module.css";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

function UnblockModal({ user, onClose, onConfirm }) {
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          <X size={18} />
        </button>

        <div className={styles.title}>
          <h3>¿Desbloquear a {user.username}?</h3>

          <span>
            Este usuario podrá volver a contactarte y enviarte mensajes
          </span>
        </div>

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>

          <button className={styles.confirm} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>,

    document.body
  );
}

export default UnblockModal;
