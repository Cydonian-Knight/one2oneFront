import styles from "./ChatItem.module.css";
import StatusDot from "../StatusDot";
import { PhoneCall, Ban, Trash2, TriangleAlert, Check, CheckCheck, FileImage, Video, Mic } from "lucide-react";
import { p } from "framer-motion/client";

function formatCallDuration(totalSeconds) {
  const secs = Number(totalSeconds) || 0;

  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  // Si hay horas → "1 hr 12 min"
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  // Si hay minutos → "34 min 12 seg"
  if (minutes > 0) {
    return `${minutes} min ${seconds} seg`;
  }

  // Solo segundos → "18 seg"
  return `${seconds} seg`;
}


const msgType = (type) => {
  if (type.isDeleted || type.isReported) return <></>;
  switch (type.type) {
    case "image":
      return <FileImage size={18} />
      break;

    case "video":
      return <Video size={18} />
      break;

    case "audio":
      return <Mic size={18} />;
      break;
    case "call":
      return <PhoneCall size={18} />;
      break;


    default:
      return <></>;
      break;
  }
}

const textType = (msg) => {
  if (msg.type === "call") {
    return <>{"Llamada - "}{formatCallDuration(msg.text)}</>
  }
  if (msg.isDeleted) return (
    <div style={{
      display: "flex", gap: "5px", alignItems: "center", fontStyle: "italic", fontWeight: "normal"
    }}>
      <Trash2 size={16} color="#6b7a90" />
      Mensaje eliminado
    </div>
  );
  if (msg.isReported) return (
    <div style={{
      display: "flex", gap: "5px", alignItems: "center", color: "#d93025", fontStyle: "italic", fontWeight: "normal"

    }}>
      <TriangleAlert size={16} color="#d93025" />
      Mensaje reportado
    </div>
  )
  if (msg.text) return msg.text;

  switch (msg.type) {
    case "video":
      return "Video";
      break;

    case "image":
      return "Imagen";
      break;

    case "audio":
      return "Audio";
      break;
  }
}

const formatChatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

  if (isSameDay(date, today)) {
    return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  if (isSameDay(date, yesterday)) {
    return "Ayer";
  }

  if (diffDays < 7) {
    return date.toLocaleDateString("es-MX", { weekday: "long" }); // lunes, martes...
  }

  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "2-digit" });
};


function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark style={{ background: "rgba(33,167,169,0.5)", fontWeight: "bold" }}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

function ChatItem({ chat, selectedChat, setSelectedChat, query }) {
  if (!chat.contact) return null;
  const isBlocked = chat.contact?.isBlocked || false;
  const blockedYou = chat.contact?.blockedYou || false;
  const isActive = selectedChat?.id === chat.id;
  const lastMsgObj =
    chat.lastMessage ||
    chat.messages?.[chat.messages.length - 1] ||
    "Sin mensajes.";
  if (new Date(lastMsgObj.createdAt).toLocaleDateString("es-MX")) {

  }

  const date = formatChatDate(lastMsgObj.createdAt);
  return (
    <div
      className={`${styles.chatItem} ${isActive ? styles.active : ""}`}
      onClick={() => setSelectedChat(chat)}
      style={{
        opacity: (isBlocked || blockedYou) && "0.35"
      }}
    >
      <div className={styles.avatarContainer}>
        <img src={chat.contact.avatarUrl || `https://ui-avatars.com/api/?name=${chat.contact.username}`} className={styles.avatar} alt="" />

        <StatusDot isOnline={(isBlocked || blockedYou) ? false : (chat.contact.isOnline || false)} />
      </div>
      <div className={styles.info}>
        <p className={styles.username}>
          {highlightMatch(chat.contact?.username, query)}
        </p>
        {(isBlocked || blockedYou) ? <p
          style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "5px", color: "#65758b" }}
        ><Ban size={16} color="red" /> <span>Usuario Bloqueado</span></p>
          :
          <p className={styles.lastMsg}
            style={{
              fontWeight:
                lastMsgObj.isOwn ? "normal" : "800",

            }}>
            {msgType(lastMsgObj)}
            {textType(lastMsgObj)}</p>
        }

      </div>
      <div className={styles.timeAndCount}>
        <p className={styles.hour}>
          {date}
        </p>
        {(isBlocked || blockedYou) ? (
          <span style={{ display: "block", visibility: "hidden" }}>a</span>
        ) : (lastMsgObj.isOwn && (!lastMsgObj.isDeleted && !lastMsgObj.isReported)) ? (
          (() => {
            switch (lastMsgObj.status) {
              case 'read':
                return <CheckCheck size={16} strokeWidth={3} color="#21a7a9" />;
              case 'delivered':
                return <CheckCheck size={16} strokeWidth={1} color="gray" />;
              default:
                return <Check size={16} strokeWidth={1} color="gray" />;
            }
          })()
        ) : (
          <div className={styles.count} style={{ visibility: chat.unreadCount > 0 ? "visible" : "hidden" }}>
            {chat.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
