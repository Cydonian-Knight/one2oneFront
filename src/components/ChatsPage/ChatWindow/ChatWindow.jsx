import styles from "./ChatWindow.module.css";
import UserHeader from "../Sidebar/UserHeader";
import DefaultChatWindow from "./DefaultChatWindow";
import MessageBox from "./MessageBox";
import Message from "./Message";
import { useEffect, useRef, useCallback, useState } from "react";
import { Phone, Video } from 'lucide-react';
import { rgba } from "framer-motion";
import toast from 'react-hot-toast';


function ChatWindow({
  chat, messages,
  currentUser, onSend,
  onSent, onClose, setShowProfile,
  onLoadMore, onDeleteMessage,
  onReportMessage,
  onInitiateCall,        // ← nuevo
  isLoadingMessages,     // ← estos tres ya los manda ChatPage
  isErrorMessages,       //    pero ChatWindow los ignoraba
  onRetryMessages,
}) {
  console.log(currentUser);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const initialScrollDoneRef = useRef(false);


  // Scroll al fondo solo cuando cambia el chat

  useEffect(() => {
    initialScrollDoneRef.current = false;
    setHasMore(true);
    isLoadingMoreRef.current = false;
  }, [chat?.id]);

  useEffect(() => {
    if (messages.length > 0 && !initialScrollDoneRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      initialScrollDoneRef.current = true;
    }
  }, [messages]);

  // Scroll al fondo cuando llega mensaje nuevo (solo si ya estaba cerca del fondo)
  const prevLengthRef = useRef(0);
  useEffect(() => {
    const container = messagesContainerRef.current;
    const newMessageArrived = messages.length > prevLengthRef.current;
    const oldMessagesLoaded = messages.length < prevLengthRef.current || isLoadingMoreRef.current;

    if (newMessageArrived && !oldMessagesLoaded) {
      const isNearBottom = container
        ? container.scrollHeight - container.scrollTop - container.clientHeight < 150
        : true;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }

    prevLengthRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (!hasMore) return;
    if (isLoadingMoreRef.current) return;
    if (container.scrollTop > 50) return; // solo cerca del tope

    const oldestMessage = messages[0];
    if (!oldestMessage) return;

    isLoadingMoreRef.current = true;

    // Guardamos la altura antes de insertar mensajes viejos
    const prevScrollHeight = container.scrollHeight;

    try {
      const res = await fetch(
        `https://one2onebackend.onrender.com/api/msg/${oldestMessage._id}/nextOnes`,
        { credentials: 'include' }
      );
      const data = await res.json();
      const older = data.data.messages;

      if (older.length === 0) {
        setHasMore(false);
        return;
      }

      await onLoadMore(older); // ChatPage inserta los mensajes al inicio del cache

      // Restauramos la posición del scroll para que no salte
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - prevScrollHeight;
        isLoadingMoreRef.current = false;
      });

      if (older.length < 20) setHasMore(false);

    } catch (err) {
      console.error('Error cargando más mensajes:', err);
      isLoadingMoreRef.current = false;
    }
  }, [messages, hasMore, onLoadMore]);

  if (!chat) return <DefaultChatWindow />;
  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <UserHeader user={chat.contact} onClick={() => setShowProfile(true)} />
        {
          !(chat.contact.blockedYou || chat.contact.isBlocked)
          &&
          <div className={styles.calls}>

            <button
              className={styles.circle}
              style={{
                cursor:
                  currentUser.subscriptionExpiresAt
                    ?
                    "pointer"
                    :
                    "not-allowed"
              }}
              onClick={() => {
                if (currentUser.subscriptionExpiresAt === false) {
                  toast.error('Obtén Premium para hacer llamadas');
                  return;
                }

                onInitiateCall(chat.contact, 'audio');
              }}
              aria-label="Llamada de voz"
            >
              <Phone size={18} color={"#000000"} />
            </button>
            <button
              className={styles.circle}
              style={{
                cursor:
                  currentUser.subscriptionExpiresAt
                    ?
                    "pointer"
                    :
                    "not-allowed"
              }}
              onClick={() => {
                if (currentUser.subscriptionExpiresAt === false) {
                  toast.error('Obtén Premium para hacer videollamadas');
                  return;
                }

                onInitiateCall(chat.contact, 'video');
              }}
              aria-label="Videollamada"
            >
              <Video size={18} color={"#000000"} />
            </button>
          </div>
        }

      </div>

      <div
        className={styles.messages}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <Message key={msg._id} msg={msg} isOwn={msg.senderId === currentUser?.id}
            onDeleteMessage={onDeleteMessage}
            onReportMessage={onReportMessage} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.messageBox}>
        <MessageBox
          conversationId={chat.id}
          currentUser={currentUser}
          onSend={onSend}
          onSent={onSent}
          chat={chat}
        />
      </div>
    </div>
  );
}

export default ChatWindow;