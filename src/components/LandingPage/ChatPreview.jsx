import ChatPreviewHeader from "./ChatPreviewHeader";
import ChatPreviewMessageBubble from "./ChatPreviewMessageBubble";
import ChatPreviewMessages from "./ChatPreviewMessages";
import styles from "./ChatPreview.module.css";
function ChatPreview() {
  return (
    <div className={styles.chatPreviewContainer}>
      <ChatPreviewHeader />
      <ChatPreviewMessages />
    </div>
  );
}

export default ChatPreview;
