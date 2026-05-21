import { useEffect, useRef, useState } from 'react';
import {
    PhoneOff,
    Mic,
    MicOff,
    Minimize2,
    Maximize2,
    User,
    Monitor
} from 'lucide-react';

import styles from './ActiveCallOverlay.module.css';

const VISIBLE_STATUSES = new Set([
    'outgoing',
    'connecting',
    'active'
]);

// ─── Hook: arrastrable ───────────────────────────────────────────────────────
function useDraggable() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const pos = {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        };

        const onMouseDown = (e) => {
            e.preventDefault();

            const rect = el.getBoundingClientRect();

            pos.x = rect.left;
            pos.y = rect.top;
            pos.startX = e.clientX;
            pos.startY = e.clientY;

            const onMouseMove = (e) => {
                const dx = e.clientX - pos.startX;
                const dy = e.clientY - pos.startY;

                let newX = pos.x + dx;
                let newY = pos.y + dy;

                newX = Math.max(
                    0,
                    Math.min(window.innerWidth - el.offsetWidth, newX)
                );

                newY = Math.max(
                    0,
                    Math.min(window.innerHeight - el.offsetHeight, newY)
                );

                el.style.left = `${newX}px`;
                el.style.top = `${newY}px`;
                el.style.right = 'auto';
                el.style.bottom = 'auto';
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        // Touch support
        const onTouchStart = (e) => {
            const touch = e.touches[0];
            const rect = el.getBoundingClientRect();

            pos.x = rect.left;
            pos.y = rect.top;
            pos.startX = touch.clientX;
            pos.startY = touch.clientY;

            const onTouchMove = (e) => {
                e.preventDefault();

                const t = e.touches[0];

                const dx = t.clientX - pos.startX;
                const dy = t.clientY - pos.startY;

                let newX = pos.x + dx;
                let newY = pos.y + dy;

                newX = Math.max(
                    0,
                    Math.min(window.innerWidth - el.offsetWidth, newX)
                );

                newY = Math.max(
                    0,
                    Math.min(window.innerHeight - el.offsetHeight, newY)
                );

                el.style.left = `${newX}px`;
                el.style.top = `${newY}px`;
                el.style.right = 'auto';
                el.style.bottom = 'auto';
            };

            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };

            document.addEventListener('touchmove', onTouchMove, {
                passive: false
            });

            document.addEventListener('touchend', onTouchEnd);
        };

        el.addEventListener('mousedown', onMouseDown);

        el.addEventListener('touchstart', onTouchStart, {
            passive: false
        });

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('touchstart', onTouchStart);
        };
    }, []);

    return ref;
}

function useTrack(ref, track) {
    useEffect(() => {
        const el = ref.current;

        if (!el || !track) return;

        track.attach(el);

        return () => track.detach(el);
    }, [ref, track]);
}

function RemoteAudio({ participant }) {
    const audioRef = useRef(null);

    const [audioTrack, setAudioTrack] = useState(null);

    useTrack(audioRef, audioTrack);

    useEffect(() => {
        if (!participant) return;

        participant.tracks.forEach(pub => {
            if (pub.kind === 'audio' && pub.track) {
                setAudioTrack(pub.track);
            }
        });

        const onSubscribed = (track) => {
            if (track.kind === 'audio') {
                setAudioTrack(track);
            }
        };

        const onUnsubscribed = (track) => {
            if (track.kind === 'audio') {
                setAudioTrack(null);
            }
        };

        participant.on('trackSubscribed', onSubscribed);
        participant.on('trackUnsubscribed', onUnsubscribed);

        return () => {
            participant.off('trackSubscribed', onSubscribed);
            participant.off('trackUnsubscribed', onUnsubscribed);
        };
    }, [participant]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            style={{ display: 'none' }}
        />
    );
}

function useCallTimer(isActive) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setSeconds(0);
            return;
        }

        const id = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);

        return () => clearInterval(id);
    }, [isActive]);

    const m = String(
        Math.floor(seconds / 60)
    ).padStart(2, '0');

    const s = String(
        seconds % 60
    ).padStart(2, '0');

    return `${m}:${s}`;
}

function RemoteVideo({ participant }) {
    const videoRef = useRef(null);

    const [videoTrack, setVideoTrack] = useState(null);

    useTrack(videoRef, videoTrack);

    useEffect(() => {
        if (!participant) return;

        participant.tracks.forEach(pub => {
            if (pub.kind === 'video' && pub.track) {
                setVideoTrack(pub.track);
            }
        });

        const onSubscribed = (track) => {
            if (track.kind === 'video') {
                setVideoTrack(track);
            }
        };

        const onUnsubscribed = (track) => {
            if (track.kind === 'video') {
                setVideoTrack(null);
            }
        };

        participant.on('trackSubscribed', onSubscribed);
        participant.on('trackUnsubscribed', onUnsubscribed);

        return () => {
            participant.off('trackSubscribed', onSubscribed);
            participant.off('trackUnsubscribed', onUnsubscribed);
        };
    }, [participant]);

    return (
        <video
            ref={videoRef}
            className={styles.remoteVideo}
            autoPlay
            playsInline
        />
    );
}

function LocalVideo({ localTracks, isScreenSharing }) {
    const videoRef = useRef(null);

    const videoTrack =
        localTracks?.find(t => t.kind === 'video') ?? null;

    useTrack(videoRef, videoTrack);

    if (!videoTrack || isScreenSharing) {
        return null;
    }

    return (
        <video
            ref={videoRef}
            className={styles.localVideo}
            autoPlay
            playsInline
            muted
        />
    );
}

// ─── Widget minimizado ───────────────────────────────────────────────────────
function MinimizedWidget({
    remoteUser,
    status,
    duration,
    onMinimize,
    onHangUp
}) {
    const draggableRef = useDraggable();

    const avatarSrc =
        remoteUser?.avatarUrl ||
        remoteUser?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            remoteUser?.username || 'Usuario'
        )}`;

    return (
        <div
            ref={draggableRef}
            className={styles.minimizedWidget}
        >
            <img
                src={avatarSrc}
                alt={remoteUser?.username || 'Usuario'}
                className={styles.miniAvatar}
            />

            <div className={styles.miniInfo}>
                <span className={styles.miniName}>
                    {remoteUser?.username ?? 'Llamada'}
                </span>

                <span className={styles.miniDuration}>
                    {status === 'active'
                        ? duration
                        : status === 'outgoing'
                            ? 'Llamando…'
                            : 'Conectando…'}
                </span>
            </div>

            <div className={styles.miniActions}>
                <button
                    className={styles.miniExpand}
                    onClick={onMinimize}
                    aria-label="Expandir"
                    onMouseDown={e => e.stopPropagation()}
                >
                    <Maximize2 size={14} />
                </button>

                <button
                    className={styles.miniHangup}
                    onClick={onHangUp}
                    aria-label="Colgar"
                    onMouseDown={e => e.stopPropagation()}
                >
                    <PhoneOff size={14} />
                </button>
            </div>
        </div>
    );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function ActiveCallOverlay({
    callState,
    onHangUp,
    onMinimize
}) {
    const {
        status,
        callType,
        remoteUser,
        minimized,
        remoteParticipant,
        localTracks
    } = callState;

    const [micMuted, setMicMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const screenTrackRef = useRef(null);
    const screenVideoRef = useRef(null);

    const duration = useCallTimer(status === 'active');

    const isVisible = VISIBLE_STATUSES.has(status);

    if (!isVisible) return null;

    if (minimized) {
        return (
            <MinimizedWidget
                remoteUser={remoteUser}
                status={status}
                duration={duration}
                onMinimize={onMinimize}
                onHangUp={onHangUp}
            />
        );
    }

    const avatarSrc =
        remoteUser?.avatarUrl ||
        remoteUser?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            remoteUser?.username || 'Usuario'
        )}`;

    const startScreenShare = async () => {
        const room = callState.room;

        if (!room) return;

        try {
            const stream =
                await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

            const mediaTrack = stream.getVideoTracks()[0];

            const { LocalVideoTrack } =
                await import('twilio-video');

            const twilioTrack =
                new LocalVideoTrack(mediaTrack, {
                    name: 'screen'
                });

            screenTrackRef.current = twilioTrack;

            if (screenVideoRef.current) {
                twilioTrack.attach(screenVideoRef.current);
            }

            const camTrack =
                localTracks?.find(t => t.kind === 'video');

            if (camTrack) {
                room.localParticipant.unpublishTrack(camTrack);
            }

            await room.localParticipant.publishTrack(twilioTrack);

            mediaTrack.onended = () => stopScreenShare();

            setIsScreenSharing(true);

        } catch (err) {
            if (err.name !== 'NotAllowedError') {
                console.error('Screen share error:', err);
            }
        }
    };

    const stopScreenShare = async () => {
        const room = callState.room;

        if (!room || !screenTrackRef.current) return;

        screenTrackRef.current.stop();

        room.localParticipant.unpublishTrack(
            screenTrackRef.current
        );

        screenTrackRef.current = null;

        const camTrack =
            localTracks?.find(t => t.kind === 'video');

        if (camTrack) {
            await room.localParticipant.publishTrack(camTrack);
        }

        setIsScreenSharing(false);
    };

    const toggleScreenShare = () => {
        isScreenSharing
            ? stopScreenShare()
            : startScreenShare();
    };

    const toggleMic = () => {
        const audioTrack =
            localTracks?.find(t => t.kind === 'audio');

        if (!audioTrack) return;

        micMuted
            ? audioTrack.enable()
            : audioTrack.disable();

        setMicMuted(m => !m);
    };

    const toggleCam = () => {
        const videoTrack =
            localTracks?.find(t => t.kind === 'video');

        if (!videoTrack) return;

        camOff
            ? videoTrack.enable()
            : videoTrack.disable();

        setCamOff(c => !c);
    };

    const isVideo = callType === 'video';

    return (
        <div className={styles.overlay}>
            <div
                className={`${styles.modal} ${isVideo && status === 'active'
                        ? styles.videoModal
                        : ''
                    }`}
            >
                <button
                    className={styles.minimizeBtn}
                    onClick={onMinimize}
                    aria-label="Minimizar"
                >
                    <Minimize2 size={16} />
                </button>

                {status === 'active' && remoteParticipant && (
                    <RemoteAudio participant={remoteParticipant} />
                )}

                {isVideo && status === 'active' && (
                    <RemoteVideo participant={remoteParticipant} />
                )}

                {isVideo && status === 'active' && (
                    <LocalVideo
                        localTracks={localTracks}
                        isScreenSharing={isScreenSharing}
                    />
                )}

                <video
                    ref={screenVideoRef}
                    className={styles.screenPreview}
                    autoPlay
                    playsInline
                    muted
                    style={{
                        display: isScreenSharing
                            ? 'block'
                            : 'none'
                    }}
                />

                {(!isVideo || status !== 'active') && (
                    <div className={styles.waitScreen}>
                        <div
                            className={`${styles.avatarRing} ${status === 'outgoing'
                                    ? styles.ringing
                                    : ''
                                }`}
                        >
                            <img
                                src={avatarSrc}
                                alt={remoteUser?.username || 'Usuario'}
                                className={styles.avatar}
                            />
                        </div>

                        <p className={styles.remoteName}>
                            {remoteUser?.username ?? 'Usuario'}
                        </p>

                        <p className={styles.statusLabel}>
                            {status === 'outgoing' && 'Llamando…'}
                            {status === 'connecting' && 'Conectando…'}
                            {status === 'active' && duration}
                        </p>

                        {status === 'connecting' && (
                            <span className={styles.spinner} />
                        )}
                    </div>
                )}

                {isVideo && status === 'active' && (
                    <div className={styles.videoDuration}>
                        {duration}
                    </div>
                )}

                <div className={styles.controls}>
                    {status === 'active' && (
                        <button
                            className={`${styles.controlBtn} ${micMuted
                                    ? styles.controlOff
                                    : ''
                                }`}
                            onClick={toggleMic}
                            aria-label={
                                micMuted
                                    ? 'Activar micrófono'
                                    : 'Silenciar'
                            }
                        >
                            {micMuted
                                ? <MicOff size={20} />
                                : <Mic size={20} />
                            }
                        </button>
                    )}

                    <button
                        className={styles.hangupBtn}
                        onClick={onHangUp}
                        aria-label="Colgar"
                    >
                        <PhoneOff size={22} />
                    </button>

                    {isVideo && status === 'active' && (
                        <button
                            className={`${styles.controlBtn} ${isScreenSharing
                                    ? styles.controlActive
                                    : ''
                                }`}
                            onClick={toggleScreenShare}
                            aria-label={
                                isScreenSharing
                                    ? 'Dejar de compartir'
                                    : 'Compartir pantalla'
                            }
                        >
                            <Monitor size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

