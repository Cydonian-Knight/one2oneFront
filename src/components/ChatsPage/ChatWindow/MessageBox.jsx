import styles from "./MessageBox.module.css";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { Paperclip, Mic, Send, SmilePlus, Square, Trash2, Ban } from "lucide-react";
import ShareFilesModal from "./ShareFilesModal";
const EmojiPicker = lazy(() => import('emoji-picker-react'));

function MessageBox({ conversationId, currentUser, onSend, onSent, chat }) {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [modalPosition, setModalPosition] = useState({ bottom: 0, left: 0 });
  const [pickerPosition, setPickerPosition] = useState({ bottom: 0, left: 0 });
  const [preview, setPreview] = useState(null);
  // Audio
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const isBlocked = chat?.contact?.isBlocked || false;
  const blockedYou = chat?.contact?.blockedYou || false;
  const ref = useRef();
  const emojiRef = useRef();

  const onEmojiClick = (emojiData) => {
    setValue(prev => prev + emojiData.emoji);
    setShowEmojis(false);
  };

  const handleEmojiToggle = () => {
    if (!showEmojis && emojiRef.current) {
      const rect = emojiRef.current.getBoundingClientRect();
      setPickerPosition({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
      });
    }
    setShowEmojis(!showEmojis);
  };

  const handleShareToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setModalPosition({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
      });
    }
    setOpen(!open);
  };

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreview({ file, url, type: file.type });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const file = new File([blob], `audio_${Date.now()}.webm`, { type: "audio/webm" });
        setPreview({ file, url, type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("No se pudo acceder al micrófono:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current?.stream?.getTracks().forEach(t => t.stop());
    mediaRecorderRef.current?.stop();
    audioChunksRef.current = [];
    clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => { };
    }
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSend = async () => {
    if (!preview && value.trim().length === 0) return;
    try {
      const tempId = `temp_${Date.now()}`;
      const type = preview?.type.startsWith("image") ? "image"
        : preview?.type.startsWith("video") ? "video"
          : preview?.type.startsWith("audio") ? "audio"
            : "text";
      onSend({
        message: {
          _id: tempId,
          conversationId,
          senderId: currentUser.id,
          type,
          content: value || null,
          mediaUrl: preview?.url || null,
          createdAt: new Date().toISOString(),
        }
      });
      setValue("");
      setPreview(null);
      const formData = new FormData();
      formData.append('conversationId', conversationId);
      formData.append('text', value || '');
      formData.append('type', type);
      if (preview?.file) formData.append('content', preview.file);
      const res = await fetch(`https://one2onebackend.onrender.com/api/msg/${conversationId}/newMessage`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const { data } = await res.json();
      onSent({
        tempId,
        realMessage: data.message,
        conversationId,
      });
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  useEffect(() => {
    setDisabled(!preview && value.trim().length === 0);
  }, [value, preview]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !disabled) handleSend();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleSend]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
      if (!emojiRef.current?.contains(e.target)) setShowEmojis(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (isRecording) {
    return (
      <div className={styles.container}>
        <button className={styles.shareButton} onClick={cancelRecording}>
          <Trash2 size={20} color="#dc2828" />
        </button>
        <div className={styles.recordingIndicator}>
          <span className={styles.recordingDot} />
          <span className={styles.recordingTime}>{formatTime(recordingTime)}</span>
        </div>
        <button className={styles.stopButton} onClick={stopRecording}>
          <Square size={18} color="white" fill="white" />
        </button>
      </div>
    );
  }

  return (
    <>
      {(isBlocked || blockedYou)
        ? (
          <div className={styles.container}>
            <span style={{ gap: "10px", fontSize: "14px", color: "#65758b", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Ban size={16} color="#65758b" />
              No puedes enviar mensajes a este usuario
            </span>
          </div>
        )
        : (
          <div className={styles.container}>
            <div ref={ref} className={styles.shareWrapper}>
              <button className={styles.shareButton} onClick={handleShareToggle}>
                <Paperclip size={20} color="#65758b" />
              </button>
            </div>

            {preview && (
              <div className={styles.previewContainer}>
                {preview.type.startsWith("image") ? (
                  <img src={preview.url} className={styles.previewImage} />
                ) : preview.type.startsWith("video") ? (
                  <video src={preview.url} className={styles.previewVideo} controls />
                ) : (
                  <audio src={preview.url} controls className={styles.previewAudio} />
                )}
                <div className={styles.previewInfo}>
                  <span>{preview.file.name}</span>
                  <span>
                    {preview.type.startsWith("image") ? "Imagen lista para enviar"
                      : preview.type.startsWith("video") ? "Video listo para enviar"
                        : "Audio listo para enviar"}
                  </span>
                </div>
                <button onClick={() => setPreview(null)}>✕</button>
              </div>
            )}

            {!preview && (
              <div ref={emojiRef} className={styles.emojiWrapper}>
                <button className={styles.emojiButton} onClick={handleEmojiToggle}>
                  <SmilePlus size={20} color="#65758b" />
                </button>
              </div>
            )}

            <input
              type="text"
              value={value}
              placeholder="Escribe un mensaje..."
              className={styles.input}
              onChange={(e) => setValue(e.target.value)}
            />

            <div className={styles.buttons}>
              {disabled ? (
                <button className={styles.audio} onClick={startRecording}>
                  <Mic size={18} color="#65758b" />
                </button>
              ) : (
                <button className={styles.sendButton} onClick={handleSend}>
                  <Send size={18} color="white" />
                </button>
              )}
            </div>
          </div>
        )
      }

      {open && createPortal(
        <div style={{
          position: 'fixed',
          bottom: `calc(${modalPosition.bottom}px - 70px)`,
          left: modalPosition.left,
          zIndex: 9999,
        }}>
          <ShareFilesModal onFileSelect={handleFile} onClose={() => setOpen(false)} />
        </div>,
        document.body
      )}

      {showEmojis && createPortal(
        <div style={{
          position: 'fixed',
          bottom: pickerPosition.bottom,
          left: pickerPosition.left,
          zIndex: 9999,
        }}>
          <Suspense fallback={null}>
            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
          </Suspense>
        </div>,
        document.body
      )}
    </>
  );
}

export default MessageBox;