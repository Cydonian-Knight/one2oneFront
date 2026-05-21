import styles from "../UserPage/BlockUserModal.module.css";

function BlockUserModal({ user, onClose, onConfirm, blockUser, conversationId }) {
  function handleConfirm() {
    blockUser({ conversationId, contactId: user.id }); // emite al socket
    onConfirm(); // actualiza UI local
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <h3>¿Bloquear a {user.username}?</h3>
          <span>
            Dejarás de recibir mensajes y llamadas de este usuario. Podrás
            desbloquearlo en cualquier momento desde su perfil.
          </span>
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.block} onClick={handleConfirm}>
            Bloquear
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockUserModal;