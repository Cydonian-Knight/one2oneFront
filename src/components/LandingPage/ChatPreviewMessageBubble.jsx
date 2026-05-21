import styles from "./MessageBubbleLandingPage.module.css";
function ChatPreviewMessageBubble({ text, isOwn }) {
  return (
    <div className={`${styles.bubble} ${isOwn ? styles.own : ""}`}>{text}</div>
  );
}

export default ChatPreviewMessageBubble;
