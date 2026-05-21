import Sidebar from "../../components/ChatsPage/Sidebar/Sidebar";
import ChatWindow from "../../components/ChatsPage/ChatWindow/ChatWindow";
import StatusBar from "../../components/ChatsPage/LoadingBar";
import styles from "../../components/ChatsPage/ChatsPage.module.css";
import NewConvoModal from "../../components/ChatsPage/Sidebar/NewConvoModal";
import IncomingCallToast from "../../components/CallsPage/IncomingCallToast";
import ActiveCallOverlay from "../../components/CallsPage/ActiveCallOverlay";
import socket from "../../services/socket";
import UserProfile from "./UserProfilePage";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { flushSync } from 'react-dom';
import { Ban, ShieldX, AlertTriangle, MapPin, MessageCircle, ShieldAlert, Monitor, Smartphone, Clock, ArrowLeft, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const sortChats = (chats) => [...chats].sort((a, b) =>
  new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
);

// Funciones auxiliares
function useCountdown(targetTimestamp) {
  const TOTAL_MS = 24 * 60 * 60 * 1000; // 24 horas en ms

  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetTimestamp, TOTAL_MS));

  useEffect(() => {
    if (!targetTimestamp) return;
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetTimestamp, TOTAL_MS));
    }, 1000);
    return () => clearInterval(id);
  }, [targetTimestamp]);

  return timeLeft;
}

function calcTimeLeft(targetTimestamp, totalMs) {
  if (!targetTimestamp) return null;
  const diff = targetTimestamp - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true, progress: 0 };

  const totalSeconds = Math.floor(diff / 1000);
  const progress = Math.min(100, (diff / totalMs) * 100); // % de tiempo restante

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
    progress, // 100% al inicio, 0% cuando expira
  };
}

// Estados posibles para el cache de mensajes de un chat:
//   undefined  → nunca se intentó cargar
//   'loading'  → fetch en vuelo
//   'error'    → todos los reintentos fallaron
//   Array      → cargado con éxito (puede ser vacío [])
const MSG_LOADING = 'loading';
const MSG_ERROR = 'error';

const INITIAL_CALL_STATE = {
  status: 'idle', callId: null, callType: null,
  remoteUser: null, token: null, minimized: false,
};

function ChatPage() {

  const [selectedChat, setSelectedChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPageVisibleRef = useRef(true);
  const [sessionKicked, setSessionKicked] = useState(null);
  const [messagesCache, setMessagesCache] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const selectedChatRef = useRef(null);
  const currentUserRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const notificationAudio = useRef(null);
  const messageAudio = useRef(null);
  const ringAudio = useRef(null);
  const endAudio = useRef(null);
  const audioUnlocked = useRef(false);

  const [callState, setCallState] = useState(INITIAL_CALL_STATE);
  const targetBanDate = currentUser?.bannedDate ? new Date(currentUser.bannedDate).getTime() : null;
  const timeLeft = useCountdown(targetBanDate);


  // ─── SOLO PARA PRUEBAS — borrar después ──────────────────────────────────────
  const testOutgoingCall = () => {
    setCallState({
      status: 'outgoing',   // cambia a 'connecting' o 'active' para ver cada estado
      callType: 'audio',    // o 'video'
      callId: 'test-123',
      remoteUser: { id: 'u1', username: 'Carlos López', avatar: null },
      token: null,
      minimized: false,
    });
  };

  const testIncomingCall = () => {
    playRing();
    setCallState({
      status: 'incoming',
      callId: 'test-123',
      callType: 'audio',          // cambia a 'video' para probar ese caso
      remoteUser: {
        id: 'user-test',
        username: 'Carlos López',
        avatar: null,             // pon una URL real si quieres ver el avatar
      },
      token: null,
      minimized: false,
    });
  };

  useEffect(() => {
    if (timeLeft?.expired) {
      window.location.reload();
    }
  }, [timeLeft?.expired]);

  // ─── AUDIO SETUP ────────────────────────────────────────────────────────────
  useEffect(() => {
    notificationAudio.current = new Audio('/notification.mp3');
    messageAudio.current = new Audio('/newmessage.mp3');
    ringAudio.current = new Audio('/ring.mp3');
    endAudio.current = new Audio('/end.mp3');
    ringAudio.current.loop = true; // para que suene en bucle mientras espera

    // Los navegadores modernos bloquean el autoplay hasta que haya un gesto
    // de usuario. Con esto "desbloqueamos" ambos audios en el primer click.
    const unlock = () => {
      if (audioUnlocked.current) return;
      [notificationAudio.current, messageAudio.current,
      ringAudio.current, endAudio.current].forEach(audio => {
        if (!audio) return;
        audio.volume = 0;
        audio.play()
          .then(() => { audio.pause(); audio.currentTime = 0; audio.volume = 1; })
          .catch(() => { });
      });
      audioUnlocked.current = true;
      document.removeEventListener('click', unlock);
    };

    document.addEventListener('click', unlock);
    return () => document.removeEventListener('click', unlock);
  }, []);

  // type: 'message' → sonido de mensaje recibido en el chat abierto
  //       'notification' → sonido de notificación (pestaña en segundo plano)
  const playSound = useCallback((type) => {
    const audio = type === 'message'
      ? messageAudio.current
      : notificationAudio.current;

    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => { });
  }, []);

  // Definir las funciones (antes de cleanupCall)
  const playRing = useCallback(() => {
    if (!ringAudio.current) return;
    ringAudio.current.currentTime = 0;
    ringAudio.current.play().catch(() => { });
  }, []);

  const stopRing = useCallback(() => {
    if (!ringAudio.current) return;
    ringAudio.current.pause();
    ringAudio.current.currentTime = 0;
  }, []);

  const playEnd = useCallback(() => {
    if (!endAudio.current) return;
    endAudio.current.currentTime = 0;
    endAudio.current.play().catch(() => { });
  }, []);


  // ─── MENSAJES: FETCH CON REINTENTOS ─────────────────────────────────────────
  //
  // Diseño del cache:
  //   - Antes de pedir → ponemos 'loading' para evitar fetches duplicados
  //   - Éxito          → guardamos el array
  //   - Error total    → guardamos 'error' (el usuario puede reintentar manualmente)
  //
  // La guard es el propio valor del cache:
  //   - Si es 'loading' → ya hay un fetch en vuelo, no duplicar
  //   - Si es Array     → ya está cargado, no volver a pedir
  //   - Si es undefined o 'error' → permitir (re)intento
  //
  const fetchMessages = useCallback((chatId, retries = 4) => {
    // Leer el estado actual sin depender del closure (usamos función de setter)
    setMessagesCache(prev => {
      const current = prev[chatId];
      // Si ya está en vuelo o cargado con éxito, no hacemos nada
      if (current === MSG_LOADING || Array.isArray(current)) return prev;
      // Marcamos como en vuelo
      return { ...prev, [chatId]: MSG_LOADING };
    });

    // El fetch real ocurre fuera del setter para no bloquear el render
    const attemptFetch = (remaining) => {
      fetch(`https://one2onebackend.onrender.com/api/msg/${chatId}/initial`, {
        credentials: "include"
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          setMessagesCache(prev => ({
            ...prev,
            [chatId]: data.data.messages
          }));
        })
        .catch(() => {
          if (remaining > 0) {
            // Backoff exponencial: 1s, 2s, 4s, 8s
            const delay = 1000 * Math.pow(2, retries - remaining);
            setTimeout(() => attemptFetch(remaining - 1), delay);
          } else {
            // Todos los reintentos fallaron → marcar como error
            // Esto permite que el usuario pueda reintentar manualmente
            setMessagesCache(prev => ({
              ...prev,
              [chatId]: MSG_ERROR
            }));
          }
        });
    };

    attemptFetch(retries);
  }, []);

  // Reintento manual (botón en el ChatWindow cuando hay error)
  const handleRetryMessages = useCallback(() => {
    const chatId = selectedChatRef.current?.id;
    if (!chatId) return;
    // Borramos el estado de error para que fetchMessages pueda correr
    setMessagesCache(prev => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
    fetchMessages(chatId);
  }, [fetchMessages]);

  // ─── OTROS HANDLERS ─────────────────────────────────────────────────────────
  // Junto con tus otros refs
  const chatsRef = useRef([]);
  useEffect(() => { chatsRef.current = chats; }, [chats]);


  // Limpiar room de Twilio y resetear estado
  const cleanupCall = useCallback(() => {
    setCallState(prev => {
      if (prev.room) prev.room.disconnect();
      return INITIAL_CALL_STATE;
    });
    stopRing();
  }, [stopRing]);

  // A inicia llamada (lo llamas desde ChatWindow al presionar 📞)
  const initiateCall = useCallback((contact, callType) => {
    setCallState({ ...INITIAL_CALL_STATE, status: 'outgoing', callType, remoteUser: contact });
    socket.emit('call:initiate', {
      targetUserId: contact.id,
      callType,
    });
  }, []);

  // B acepta
  const acceptCall = useCallback(() => {
    stopRing();   // ← agregar
    setCallState(prev => ({ ...prev, status: 'connecting' }));
    socket.emit('call:accept', {
      callId: callStateRef.current.callId,
      callerId: callStateRef.current.remoteUser?.id,
    });
  }, []);

  // B rechaza
  const rejectCall = useCallback(() => {
    socket.emit('call:reject', {
      callId: callStateRef.current.callId,
      callerId: callStateRef.current.remoteUser?.id,
    });
    stopRing();
    setCallState(INITIAL_CALL_STATE);
  }, [stopRing]);

  // Cualquiera cuelga
  const hangUp = useCallback(() => {
    socket.emit('call:end', {
      callId: callStateRef.current.callId,
      targetUserId: callStateRef.current.remoteUser?.id,
    });
    playEnd();
    cleanupCall();
  }, [cleanupCall, playEnd]);

  // Conectar a Twilio Room (se llama cuando llega call:ready)
  const connectToRoom = useCallback(async (token, callId) => {
    const { connect, createLocalTracks } = await import('twilio-video');
    const callType = callStateRef.current.callType;

    try {
      const tracks = await createLocalTracks({
        audio: true,
        video: callType === 'video' ? { width: 640 } : false,
      });

      const room = await connect(token, { name: callId, tracks });

      setCallState(prev => ({ ...prev, status: 'active', room, localTracks: tracks }));

      room.on('disconnected', () => { playEnd(); cleanupCall(); });
      room.on('participantConnected', p => {
        setCallState(prev => ({ ...prev, remoteParticipant: p }));
      });
      room.participants.forEach(p => {
        setCallState(prev => ({ ...prev, remoteParticipant: p }));
      });

    } catch (err) {
      console.error('Error conectando a Twilio:', err);
      cleanupCall();
    }
  }, [cleanupCall, playEnd]);

  // Ref para leer callState dentro de callbacks sin stale closure
  const callStateRef = useRef(callState);
  useEffect(() => { callStateRef.current = callState; }, [callState]);

  const handleLoadMore = useCallback((olderMessages) => {
    const chatId = selectedChat?.id;
    if (!chatId) return;
    setMessagesCache(prev => ({
      ...prev,
      [chatId]: [...olderMessages, ...(Array.isArray(prev[chatId]) ? prev[chatId] : [])]
    }));
  }, [selectedChat?.id]);

  const handleDeleteMessage = useCallback(({ messageId, conversationId }) => {
    socket.emit('message:delete', { messageId, conversationId });
  }, []);

  const handleReportMessage = useCallback(({ messageId, conversationId, reason }) => {
    socket.emit('message:report', { messageId, conversationId, reason });
  }, []);

  const blockUser = useCallback(({ conversationId, contactId }) => {
    socket.emit('user:block', { conversationId, contactId });
  }, []);

  const unblockUser = useCallback(({ conversationId, contactId }) => {
    socket.emit('user:unblock', { conversationId, contactId });
  }, []);

  // ----- UseEffect de Toast -----
  useEffect(() => {
    if (currentUser?.strikes === 1) {
      toast.custom((t) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'white',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '15px',
          fontWeight: '550',
          color: '#1f2937',
          opacity: t.visible ? 1 : 0,
          transition: 'opacity 0.3s',
          maxWidth: '420px',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)',
        }}>
          <AlertTriangle size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700' }}>Advertencia en tu cuenta</span>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '400' }}>
              Has recibido un strike por comportamiento inapropiado.
              Con 2 strikes tu cuenta será suspendida temporalmente.
            </span>
          </div>
        </div>
      ), { duration: 8000, position: 'top-center' });  // 8 segundos
    }
  }, [currentUser?.strikes]);

  // ─── VISIBILIDAD DE LA PESTAÑA ───────────────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ─── PERMISOS DE NOTIFICACIONES ──────────────────────────────────────────────
  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  }, []);

  // ─── SINCRONIZAR REFS ────────────────────────────────────────────────────────
  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // ─── SOCKET + CARGA INICIAL ──────────────────────────────────────────────────
  useEffect(() => {
    let interval;

    socket.on('session:duplicate', (data) => setSessionKicked(data));
    socket.on('session:accepted', () => setSessionKicked(null));
    socket.on('session:kicked', () => navigate('/auth/login'));

    socket.on('connect', () => {
      setProgress(100);
      clearInterval(interval);
      setTimeout(() => setIsLoading(false), 1000);

      const chatId = selectedChatRef.current?.id;
      if (chatId) {
        // Invalidar cache del chat activo para forzar recarga tras reconexión
        // Solo invalidamos si NO está en vuelo (para no duplicar)
        setMessagesCache(prev => {
          const current = prev[chatId];
          if (current === MSG_LOADING) return prev;
          const next = { ...prev };
          delete next[chatId];
          return next;
        });
        fetchMessages(chatId);
      }
    });

    socket.on('contacts:online', (onlineContactIds) => {
      setChats(prev => prev.map(c => ({
        ...c,
        contact: { ...c.contact, isOnline: onlineContactIds.includes(c.contact?.id) }
      })));
    });

    socket.on('user:status', ({ userId, status, lastSeenAt }) => {
      setChats(prev => prev.map(c =>
        c.contact?.id === userId
          ? { ...c, contact: { ...c.contact, isOnline: status === 'online', lastSeenAt } }
          : c
      ));
    });

    socket.on('message:deleted', ({ messageId, conversationId }) => {
      setMessagesCache(prev => {
        const msgs = prev[conversationId];
        if (!Array.isArray(msgs)) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map(m =>
            m._id === messageId ? { ...m, isDeleted: true, content: '', mediaUrl: null } : m
          )
        };
      });
      setChats(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: { ...c.lastMessage, isDeleted: true, text: '' } }
          : c
      ));
    });

    socket.on('message:reported', ({ messageId, conversationId }) => {
      setMessagesCache(prev => {
        const msgs = prev[conversationId];
        if (!Array.isArray(msgs)) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map(m =>
            m._id === messageId ? { ...m, isReported: true } : m
          )
        };
      });
      setChats(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: { ...c.lastMessage, isReported: true } }
          : c
      ));
    });

    socket.on('user:blocked', ({ conversationId }) => {
      setChats(prev => prev.map(c =>
        c.id === conversationId ? { ...c, contact: { ...c.contact, isBlocked: true } } : c
      ));
    });

    socket.on('user:blocked_by', ({ conversationId }) => {
      setChats(prev => prev.map(c =>
        c.id === conversationId ? { ...c, contact: { ...c.contact, blockedYou: true } } : c
      ));
    });

    socket.on('user:unblocked', ({ conversationId }) => {
      setChats(prev => prev.map(c =>
        c.id === conversationId ? { ...c, contact: { ...c.contact, isBlocked: false } } : c
      ));
    });

    socket.on('user:unblocked_by', ({ conversationId }) => {
      setChats(prev => prev.map(c =>
        c.id === conversationId ? { ...c, contact: { ...c.contact, blockedYou: false } } : c
      ));
    });

    socket.on('new_message', ({ message, conversationId }) => {
      // Solo añadir al cache si ya existe como array (no si está en error/loading)
      setMessagesCache(prev => {
        const current = prev[conversationId];
        if (!Array.isArray(current)) return prev;
        if (current.some(m => m._id === message._id)) return prev; // deduplicar
        return { ...prev, [conversationId]: [...current, message] };
      });

      setChats(prev => sortChats(prev.map(c =>
        c.id === conversationId
          ? {
            ...c,
            lastMessage: {
              text: message.content,
              type: message.type,
              senderId: message.senderId,
              createdAt: message.createdAt,
              isOwn: false,
              status: message.status ?? 'sent'
            }
          }
          : c
      )));

      const isInConversation = selectedChatRef.current?.id === conversationId;
      const endpoint = isInConversation ? 'read' : 'delivered';

      fetch(`https://one2onebackend.onrender.com/api/conversation/${conversationId}/${endpoint}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      // ── Sonidos ──────────────────────────────────────────────────────────────
      // Caso A: estás en el chat → sonido de mensaje nuevo
      // Caso B: pestaña en segundo plano Y no estás en ese chat → notificación
      if (isInConversation) {
        playSound('message');
      } else if (!isPageVisibleRef.current) {
        playSound('notification');
        if (Notification.permission === 'granted') {
          new Notification(message.senderName, {
            body: message.content,
            icon: '/icon.png'
          });
        }
      }
      // Si la pestaña es visible pero el chat no está seleccionado, no suena
      // (comportamiento igual al original — puedes cambiar esto si prefieres)
    });

    socket.on('unread_update', ({ conversationId }) => {
      setChats(prev => prev.map(c => {
        if (c.id !== conversationId) return c;
        if (c.id === selectedChatRef.current?.id) return { ...c, unreadCount: 0 };
        return { ...c, unreadCount: (c.unreadCount || 0) + 1 };
      }));
    });

    socket.on('message:read', ({ conversationId }) => {
      setMessagesCache(prev => {
        const msgs = prev[conversationId];
        if (!Array.isArray(msgs)) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map(m =>
            m.senderId === currentUserRef.current?.id ? { ...m, status: 'read' } : m
          )
        };
      });
      setChats(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: { ...c.lastMessage, status: 'read' } }
          : c
      ));
    });

    socket.on('message:delivered', ({ conversationId }) => {
      setMessagesCache(prev => {
        const msgs = prev[conversationId];
        if (!Array.isArray(msgs)) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map(m =>
            m.senderId === currentUserRef.current?.id && m.status === 'sent'
              ? { ...m, status: 'delivered' }
              : m
          )
        };
      });
      setChats(prev => prev.map(c =>
        c.id === conversationId && c.lastMessage?.status === 'sent'
          ? { ...c, lastMessage: { ...c.lastMessage, status: 'delivered' } }
          : c
      ));
    });


    // A recibe confirmación de que B está siendo llamado → empieza a sonar
    socket.on('call:ringing', ({ callId }) => {
      setCallState(prev => ({ ...prev, status: 'outgoing', callId }));
      playRing();
    });

    // B recibe llamada entrante → muestra toast
    socket.on('call:incoming', ({ callId, callType, callerId }) => {
      const caller = chatsRef.current.find(c => c.contact?.id === callerId)?.contact || null;
      setCallState({
        status: 'incoming',
        callId,
        callType,
        remoteUser: caller,
        token: null,
        minimized: false,
      });
      playRing();
    });

    // Ambos reciben token → conectar a Twilio Room
    socket.on('call:ready', ({ token, callId }) => {
      stopRing();
      setCallState(prev => ({ ...prev, status: 'connecting', token }));
      // connectToRoom lo defines abajo — recibe token y callId
      connectToRoom(token, callId);
    });

    // A recibe rechazo de B
    socket.on('call:rejected', ({ callId }) => {
      stopRing();
      playEnd();
      setCallState({ status: 'idle', callId: null, callType: null, remoteUser: null, token: null, minimized: false });
    });

    // Cualquiera recibe que el otro colgó
    socket.on('call:ended', ({ callId }) => {
      stopRing();
      playEnd();
      cleanupCall(); // desconecta room y limpia estado
    });

    // B no estaba online cuando A intentó llamar
    socket.on('call:unavailable', () => {
      stopRing();
      setCallState(prev => ({ ...INITIAL_CALL_STATE }));
    });

    Promise.all([
      fetch("https://one2onebackend.onrender.com/api/user/header", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }),
      fetch("https://one2onebackend.onrender.com/api/conversation/allConversations", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
    ])
      .then(responses => {
        setProgress(40);
        return Promise.all(responses.map(r => {
          if (r.status === 401) { navigate('/auth/login'); return null; }
          return r.json();
        }));
      })
      .then(([user, chat]) => {
        if (!user || !chat) return;
        setCurrentUser({
          id: user.data.id,
          username: user.data.username,
          avatar: user.data.avatarUrl,
          isOnline: true,
          subscriptionExpiresAt: user.data.subscriptionExpiresAt
            ? new Date(user.data.subscriptionExpiresAt) > new Date()
            : false,
          strikes: user.data.strikes,
          bannedDate: user.data.bannedDate,

        });
        console.log(user);
        setChats(sortChats(chat.data.conversations));
        if (!socket.connected) socket.connect();
        setProgress(70);
        if (socket.connected) {
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 1000);
        }
      });

    return () => {
      clearInterval(interval);
      socket.off('connect');
      socket.off('session:duplicate');
      socket.off('session:accepted');
      socket.off('session:kicked');
      socket.off('contacts:online');
      socket.off('user:status');
      socket.off('new_message');
      socket.off('unread_update');
      socket.off('message:read');
      socket.off('message:delivered');
      socket.off('message:deleted');
      socket.off('message:reported');
      socket.off('user:blocked');
      socket.off('user:blocked_by');
      socket.off('user:unblocked');
      socket.off('user:unblocked_by');
      socket.off('call:ringing');
      socket.off('call:incoming');
      socket.off('call:ready');
      socket.off('call:rejected');
      socket.off('call:ended');
      socket.off('call:unavailable');
      socket.disconnect();
    };
  }, []);

  // ─── CARGAR MENSAJES AL SELECCIONAR CHAT ────────────────────────────────────
  useEffect(() => {
    if (!selectedChat) return;

    // Limpiar unread count del chat seleccionado
    setChats(prev => prev.map(c =>
      c.id === selectedChat.id ? { ...c, unreadCount: 0 } : c
    ));
    fetch(`https://one2onebackend.onrender.com/api/conversation/${selectedChat.id}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    const current = messagesCache[selectedChat.id];

    // Si ya está cargado con éxito (array), no volver a pedir
    if (Array.isArray(current)) return;

    // Si está en vuelo, tampoco pedir de nuevo
    if (current === MSG_LOADING) return;

    // En cualquier otro caso (undefined, 'error') → intentar cargar
    // Primero borramos cualquier estado de error previo para dar paso limpio
    if (current === MSG_ERROR) {
      setMessagesCache(prev => {
        const next = { ...prev };
        delete next[selectedChat.id];
        return next;
      });
    }

    fetchMessages(selectedChat.id);
  }, [selectedChat?.id]);

  // ─── ENVÍO DE MENSAJES ───────────────────────────────────────────────────────
  const handleSendMessage = ({ message }) => {
    flushSync(() => {
      setMessagesCache(prev => {
        const current = prev[message.conversationId];
        return {
          ...prev,
          [message.conversationId]: Array.isArray(current)
            ? [...current, message]
            : [message]
        };
      });
      setChats(prev => sortChats(prev.map(c =>
        c.id === message.conversationId
          ? {
            ...c,
            lastMessage: {
              text: message.content,
              type: message.type,
              senderId: message.senderId,
              createdAt: message.createdAt,
              isOwn: true,
              status: message.status ?? 'sent'
            }
          }
          : c
      )));
    });
  };

  const handleMessageSent = ({ tempId, realMessage, conversationId }) => {
    setMessagesCache(prev => {
      const msgs = prev[conversationId];
      if (!Array.isArray(msgs)) return prev;
      return {
        ...prev,
        [conversationId]: msgs.map(m => m._id === tempId ? realMessage : m)
      };
    });
  };

  // ─── DERIVADAS ───────────────────────────────────────────────────────────────
  const cachedValue = messagesCache[selectedChat?.id];
  const messages = Array.isArray(cachedValue) ? cachedValue : [];
  const isLoadingMessages = selectedChat
    ? (cachedValue === undefined || cachedValue === MSG_LOADING)
    : false;
  const isErrorMessages = selectedChat ? cachedValue === MSG_ERROR : false;
  const currentChat = chats.find(c => c.id === selectedChat?.id) || null;

  // ─── PANTALLA: SESIÓN DUPLICADA ──────────────────────────────────────────────
  if (sessionKicked) return (
    <div className={styles.loading}>
      <div className={styles.nameLogoContainer}>
        <div className={styles.navbarImgContainer}>
          <MessageCircle size={28} color="white" />
        </div>
        <h2>One2One</h2>
      </div>
      <div className={styles.sessionContainer}>
        <div className={styles.warningSection}>
          <div className={styles.navbarImgContainer} style={{ background: "#fbe9e9" }}>
            <ShieldAlert size={40} color={"#dc2828"} />
          </div>
          <div className={styles.warningText}>
            <p className={styles.warningTitle}>Sesión activa detectada</p>
            <p className={styles.warningDescription}>
              Por seguridad, One2One solo permite una sesión activa por cuenta.
              Si continúas, la sesión anterior se cerrará automáticamente.
            </p>
          </div>
        </div>
        <div className={styles.currentSession}>
          <div className={styles.currentSessionTitle}>SESIÓN ANTERIOR</div>
          <div className={styles.device}>
            {sessionKicked.device.device === "desktop"
              ? <Monitor size={20} color={"#1dafa1"} />
              : <Smartphone size={20} color={"#1dafa1"} />
            }
            {sessionKicked.device.browser}, {sessionKicked.device.os}
          </div>
          <div className={styles.account}>
            Cuenta: <span className={styles.email}>{sessionKicked.email}</span>
          </div>
          <div className={styles.device} style={{ color: "var(--secondary-color)" }}>
            <Clock size={20} color="var(--secondary-color)" />
            Iniciada: {new Date(sessionKicked.connectedAt).toLocaleString("es-MX", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit", second: "2-digit",
            })}
          </div>
          <div className={styles.device} style={{ color: "var(--secondary-color)" }}>
            <MapPin size={20} color="var(--secondary-color)" />
            {sessionKicked.location.city}, {sessionKicked.location.country}, {sessionKicked.location.region}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={() => { socket.disconnect(); navigate('/auth/login'); }}>
            <ArrowLeft size={20} />
            Cancelar
          </button>
          <button
            onClick={() => socket.emit('session:force', { existingSocketId: sessionKicked.existingSocketId })}
            style={{ color: "white", background: "var(--primary-gradient)" }}
          >
            <LogOut size={20} color={"white"} />
            Cerrar la otra sesión
          </button>
        </div>
      </div>
      <div className={styles.disclaimer}>
        ¿No reconoces esta sesión? Te recomendamos cambiar tu contraseña después de continuar.
      </div>
    </div>
  );
  console.log("HOLAAA", currentUser)

  if (currentUser?.strikes === 2 && Date.now() < new Date(currentUser?.bannedDate).getTime()) {

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", currentUser);
    return (
      <div className={styles.loading}>
        <div className={styles.nameLogoContainer}>
          <div className={styles.navbarImgContainer}>
            <MessageCircle size={28} color="white" />
          </div>
          <h2>One2One</h2>
        </div>
        <div className={styles.sessionContainer}>
          <div className={styles.warningSection}>
            <div className={styles.navbarImgContainer} style={{ background: "#fbe9e9" }}>
              <Ban size={40} color={"#f59e0b"} />
            </div>
            <div className={styles.warningText}>
              <p className={styles.warningTitle}>Cuenta suspendida temporalmente</p>
              <p className={styles.warningDescription}>
                Tu cuenta ha acumulado <b style={{ color: "black" }}>2 strikes</b> . Tu cuenta estará inhabilitada por 24 horas. Al recibir un tercer strike, tu cuenta será inhabilitada de forma permanente.
              </p>
            </div>
          </div>
          <div className={styles.blockedSession}>
            <div className={styles.currentSessionTitle}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}>
              <Clock size={20} color="var(--secondary-color)" />
              TIEMPO RESTANTE</div>
            <span>
              {timeLeft
                ? `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
                : '--:--:--'
              }
            </span>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'var(--border-color, #e5e7eb)',
              borderRadius: '999px',
              overflow: 'hidden',
              margin: '8px 0 16px',
            }}>
              <div style={{
                height: '100%',
                width: `${timeLeft?.progress ?? 0}%`,
                background: 'var(--primary-gradient)',
                borderRadius: '999px',
                transition: 'width 1s linear',
              }} />
            </div>
            <span>Tu cuenta sera reactivada el {new Date(currentUser?.bannedDate).toLocaleString("es-MX", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit", second: "2-digit",
            })}</span>

          </div>
          <div className={styles.buttonContainer}>
            <button onClick={() => { navigate('/auth/login'); }}>
              <ArrowLeft size={20} />
              Regresar al Inicio
            </button>

          </div>
        </div>

      </div>
    );
  }

  if (currentUser?.strikes >= 3) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", currentUser);
    return (
      <div className={styles.loading}>
        <div className={styles.nameLogoContainer}>
          <div className={styles.navbarImgContainer}>
            <MessageCircle size={28} color="white" />
          </div>
          <h2>One2One</h2>
        </div>
        <div className={styles.sessionContainer}>
          <div className={styles.warningSection}>
            <div className={styles.navbarImgContainer} style={{ background: "#fbe9e9" }}>
              <ShieldX size={40} color={"#dc2828"} />
            </div>
            <div className={styles.warningText}>
              <p className={styles.warningTitle}>Cuenta inhabilitada permanentemente</p>
              <p className={styles.warningDescription}>
                Tu cuenta ha acumulado <b style={{ color: "black" }}>3 o más strikes</b> por incumplir las normas comunitarias de One2One.
                Por seguridad de la plataforma, ya no podrás acceder a esta cuenta.
              </p>
            </div>
          </div>
          <div className={styles.blockedSession}>
            <p className={styles.errorQuestion}>¿Crees Que fue un error?</p>
            <p className={styles.errorText}>Puedes enviar una apelación al equipo de administración. Revisaremos tu caso y te responderemos por correo electrónico.

            </p>
            <div className={styles.apelarButton}>
              <button onClick={() => window.location.href = `mailto:one2one.client.support@gmail.com?subject=Apelación Bloqueo de Cuenta&body=Hola, mi nombre de usuario es ${currentUser.username} y quisiera apelar el bloqueo de mi cuenta.`}>
                Apelar bloqueo
              </button>
            </div>

          </div>
          <div className={styles.buttonContainer}>
            <button onClick={() => { navigate('/auth/login'); }}>
              <ArrowLeft size={20} />
              Regresar al Inicio
            </button>

          </div>
        </div>

      </div>
    );
  }

  // ─── PANTALLA: CARGA INICIAL ─────────────────────────────────────────────────
  if (isLoading) return (
    <div className={styles.loading}>
      <div className={styles.nameLogoContainer}>
        <div className={styles.navbarImgContainer}>
          <MessageCircle size={28} color="white" />
        </div>
        <h2>One2One</h2>
      </div>
      <StatusBar progress={progress} />
    </div>
  );
  // ─── PANTALLA: PERFIL / CHAT ─────────────────────────────────────────────────
  return (
    <>
      {/* ✅ Siempre montados, independiente de la vista activa */}
      <IncomingCallToast
        callState={callState}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
      <ActiveCallOverlay
        callState={callState}
        onHangUp={hangUp}
        onMinimize={() => setCallState(prev => ({ ...prev, minimized: !prev.minimized }))}
      />

      {showProfile ? (
        <UserProfile
          blockUser={blockUser}
          user={currentChat?.contact}
          conversationId={currentChat?.id}
          onClose={() => setShowProfile(false)}
          unblockUser={unblockUser}
        />
      ) : (
        <div className={styles.container}>
          <Sidebar
            currentUser={currentUser}
            chats={chats}
            selectedChat={currentChat}
            setSelectedChat={setSelectedChat}
            onOpenModal={() => setIsModalOpen(true)}
          />
          <ChatWindow
            chat={currentChat}
            messages={messages}
            currentUser={currentUser}
            onSend={handleSendMessage}
            onSent={handleMessageSent}
            setShowProfile={setShowProfile}
            isLoadingMessages={isLoadingMessages}
            isErrorMessages={isErrorMessages}
            onRetryMessages={handleRetryMessages}
            onClose={() => setSelectedChat(null)}
            onLoadMore={handleLoadMore}
            onDeleteMessage={handleDeleteMessage}
            onReportMessage={handleReportMessage}
            onInitiateCall={initiateCall}
          />
          {isModalOpen && <NewConvoModal onClose={() => setIsModalOpen(false)} />}
        </div>
      )}
    </>
  );
}

export default ChatPage;