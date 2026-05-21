import ChatPreviewMessageBubble from "./ChatPreviewMessageBubble";
import styles from "./ChatPreviewMessages.module.css";

function ChatPreviewMessages() {
  return (
    <div className={styles.messages}>
      <ChatPreviewMessageBubble text="¡Hola! ¿Viste la nueva función de videollamadas?" />
      <ChatPreviewMessageBubble
        text="¡Sí! La probé y la calidad es increíble"
        isOwn
      />
      <ChatPreviewMessageBubble text="Además, ahora podemos compartir pantalla" />
    </div>
  );
}

export default ChatPreviewMessages;
