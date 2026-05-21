import styles from "./BlockedItem.module.css";

function BlockedItem({ icon, username, email, onUnblock }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={icon} alt="" className={styles.image} />
        <div className={styles.userInfo}>
          <span className={styles.usrname}>{username}</span>
          <span className={styles.mail}>{email}</span>
        </div>
      </div>
      <button className={styles.button} onClick={onUnblock}>
        Desbloquear
      </button>
    </div>
  );
}

export default BlockedItem;
