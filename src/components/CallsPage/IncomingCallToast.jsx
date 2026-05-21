import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Phone, PhoneOff, Video, PhoneIncoming } from 'lucide-react';
import styles from './IncomingCallToast.module.css';

const TIMEOUT_SECONDS = 30;

// ─── Toast Content ───────────────────────────────────────────────────────────
function CallToastContent({ t, callState, onAccept, onReject }) {
    const [seconds, setSeconds] = useState(TIMEOUT_SECONDS);
    const { remoteUser, callType } = callState;

    // Countdown visual
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const progress = (seconds / TIMEOUT_SECONDS) * 100;

    // Avatar final
    const avatarSrc =
        remoteUser?.avatarUrl ||
        remoteUser?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            remoteUser?.username || 'Usuario'
        )}`;

    return (
        <div className={`${styles.toast} ${t.visible ? styles.enter : styles.leave}`}>
            {/* Progress bar */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{
                        width: `${progress}%`,
                        transition:
                            seconds === TIMEOUT_SECONDS
                                ? 'none'
                                : 'width 1s linear',
                    }}
                />
            </div>

            <div className={styles.content}>
                {/* Avatar */}
                <div className={styles.avatarWrapper}>
                    <img
                        src={avatarSrc}
                        alt={remoteUser?.username || 'Usuario'}
                        className={styles.avatar}
                    />

                    {/* Indicador de tipo de llamada */}
                    <span className={styles.callTypeBadge}>
                        {callType === 'video'
                            ? <Video size={10} />
                            : <Phone size={10} />
                        }
                    </span>
                </div>

                {/* Info */}
                <div className={styles.info}>
                    <span className={styles.label}>
                        <PhoneIncoming size={12} />
                        Llamada entrante · {callType === 'video' ? 'Video' : 'Audio'}
                    </span>

                    <span className={styles.username}>
                        {remoteUser?.username ?? 'Usuario'}
                    </span>

                    <span className={styles.timer}>
                        {seconds}s
                    </span>
                </div>

                {/* Botones */}
                <div className={styles.actions}>
                    <button
                        className={styles.rejectBtn}
                        onClick={onReject}
                        aria-label="Rechazar llamada"
                    >
                        <PhoneOff size={18} />
                    </button>

                    <button
                        className={styles.acceptBtn}
                        onClick={onAccept}
                        aria-label="Aceptar llamada"
                    >
                        <Phone size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── IncomingCallToast ────────────────────────────────────────────────────────
export default function IncomingCallToast({
    callState,
    onAccept,
    onReject
}) {
    const toastIdRef = useRef(null);
    const timerRef = useRef(null);

    const dismissToast = () => {
        if (toastIdRef.current !== null) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }

        clearTimeout(timerRef.current);
    };

    const handleAccept = () => {
        dismissToast();
        onAccept();
    };

    const handleReject = () => {
        dismissToast();
        onReject();
    };

    useEffect(() => {
        if (callState.status === 'incoming') {
            // Mostrar toast
            const id = toast.custom(
                (t) => (
                    <CallToastContent
                        t={t}
                        callState={callState}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                ),
                {
                    duration: Infinity,
                    position: 'top-center',
                }
            );

            toastIdRef.current = id;

            // Auto reject
            timerRef.current = setTimeout(() => {
                dismissToast();
                onReject();
            }, TIMEOUT_SECONDS * 1000);

        } else {
            dismissToast();
        }

        return () => dismissToast();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callState.status]);

    return null;
}