import styles from "./ChatPreviewHeaderLP.module.css";
function ChatPreviewHeader() {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatAvatar}>P</div>
      <div>
        <p className={styles.name}>Paola</p>
        <span className={styles.status}>En línea</span>
      </div>
    </div>
  );
}
export default ChatPreviewHeader;
