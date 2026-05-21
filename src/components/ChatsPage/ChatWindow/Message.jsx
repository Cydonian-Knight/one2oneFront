import styles from "./Message.module.css";

import {
  Trash2,
  TriangleAlert,
  Check,
  CheckCheck,
  PhoneCall
} from "lucide-react";

import { useState } from "react";

import AudioPlayer from "./AudioPlayer";
import MessageActions from "./MessageActions";
import { p, span } from "framer-motion/client";

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

function Message({ msg, isOwn, onDeleteMessage, onReportMessage }) {
  const [videoOpen, setVideoOpen] = useState(false);

  const isMe = isOwn;

  const hour = new Date(
    msg.createdAt
  ).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const renderContent = () => {
    if (msg.isDeleted) {
      return (
        <div className={styles.deletedMsg}>
          <Trash2 size={16} color="#6b7a90" />
          Mensaje eliminado
        </div>
      );
    }
    if (msg.isReported) {
      return (
        <div className={styles.reportedMsg}>
          <TriangleAlert size={16} color="#d93025" />
          Mensaje reportado
        </div>
      );
    }
    switch (msg.type) {
      case "text":
        return <p>{msg.content}</p>;

      case "image":
        return (
          <>
            <img
              src={msg.mediaUrl}
              className={styles.image}
            />

            <p
              style={{
                marginTop: "5px",
                marginLeft: "8px",
                marginBottom: "-5px"
              }}
            >
              {msg.content}
            </p>
          </>
        );

      case "audio":
        return (
          <>
            <AudioPlayer
              src={msg.mediaUrl}
              isOwn={msg.isOwn ?? true}
            />

            <p
              style={{
                marginTop: "5px",
                marginLeft: "8px",
                marginBottom: "-5px"
              }}
            >
              {msg.content}
            </p>
          </>
        );

      case "video":
        return (
          <>
            <video
              src={msg.mediaUrl}
              className={styles.video}
              onClick={() => setVideoOpen(true)}
            />

            <p
              style={{
                marginTop: "5px",
                marginLeft: "8px",
                marginBottom: "-5px"
              }}
            >
              {msg.content}
            </p>

            {videoOpen && (
              <div
                className={styles.videoModal}
                onClick={() => setVideoOpen(false)}
              >
                <div
                  className={styles.videoModalContent}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <button
                    className={styles.videoModalClose}
                    onClick={() =>
                      setVideoOpen(false)
                    }
                  >
                    ✕
                  </button>

                  <video
                    controls
                    autoPlay
                    src={msg.mediaUrl}
                    className={
                      styles.videoModalPlayer
                    }
                  />
                </div>
              </div>
            )}
          </>
        );
      default:
        return <p>Tipo no soportado</p>;
    }
  };

  if (msg.isDeleted || msg.isReported) {
    return (
      <div className={`${styles.message} ${isMe ? styles.me : styles.other}`}>
        <div className={styles.systemBubble}>
          {renderContent()}
        </div>
      </div>
    );
  }

  if (msg.type === "call") {
    return (
      <div className={styles.phoneCall}>
        <PhoneCall size={18} />
        {"Llamada - "}
        {formatCallDuration(msg.content)}
      </div>
    );
  }

  let padding;

  if (msg.type === "text" && !msg.mediaUrl) {
    padding = "2px 15px";
  } else if (
    msg.type === "image" &&
    msg.content
  ) {
    padding = "5px";
  }

  return (
    <div
      className={`${styles.message} ${isMe ? styles.me : styles.other
        }`}
    >
      <div
        className={styles.bubble}
        style={{ padding }}
      >


        {renderContent()}

        <span className={styles.time}>
          {hour}

          {isMe &&
            (() => {
              switch (msg.status) {
                case "read":
                  return (
                    <CheckCheck
                      size={16}
                      strokeWidth={3}
                      color="#21a7a9"
                      style={{
                        filter: `
                          drop-shadow(0 0 2px #FFFFFF)
                          drop-shadow(0 0 4px #FFFFFF)
                        `
                      }}
                    />
                  );

                case "delivered":
                  return (
                    <CheckCheck
                      size={16}
                      strokeWidth={1}
                      color="#FFFFFF"
                    />
                  );

                case "sent":
                default:
                  return (
                    <Check
                      size={16}
                      strokeWidth={1}
                      color="#FFFFFF"
                    />
                  );
              }
            })()}
        </span>
        <MessageActions
          messageId={msg._id}
          isOwn={isMe}
          conversationId={msg.conversationId}
          onDeleteMessage={onDeleteMessage}
          onReportMessage={onReportMessage}
          isDeleted={msg.isDeleted}
          isReported={msg.isReported}
        />
      </div>
    </div>
  );
}

export default Message;
