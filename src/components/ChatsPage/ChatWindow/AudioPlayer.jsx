import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import styles from "./AudioPlayer.module.css";

const BAR_COUNT = 40;

function AudioPlayer({ src, isOwn }) {
    const audioRef = useRef(null);
    const rafRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bars, setBars] = useState(Array(BAR_COUNT).fill(0.1));
    const color = isOwn ? "#FFFFFF" : "#25a6cb";

    useEffect(() => {
        const analyzeAudio = async () => {
            try {
                const res = await fetch(src);
                const arrayBuffer = await res.arrayBuffer();
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const decoded = await audioCtx.decodeAudioData(arrayBuffer);
                const channelData = decoded.getChannelData(0);
                const blockSize = Math.floor(channelData.length / BAR_COUNT);
                const amplitudes = [];
                for (let i = 0; i < BAR_COUNT; i++) {
                    let sum = 0;
                    for (let j = 0; j < blockSize; j++) {
                        sum += Math.abs(channelData[i * blockSize + j]);
                    }
                    amplitudes.push(sum / blockSize);
                }
                const max = Math.max(...amplitudes);
                setBars(amplitudes.map(a => Math.max(0.05, a / max)));
                audioCtx.close();
            } catch (err) {
            }
        };
        analyzeAudio();
    }, [src]);

    // Limpia el RAF al desmontar
    useEffect(() => {
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const tick = useCallback(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            cancelAnimationFrame(rafRef.current);
        } else {
            audio.play();
            rafRef.current = requestAnimationFrame(tick);
        }
        setIsPlaying(!isPlaying);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        cancelAnimationFrame(rafRef.current);
    };

    const handleBarClick = (index) => {
        const audio = audioRef.current;
        const newTime = (index / BAR_COUNT) * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (secs) => {
        if (isNaN(secs)) return "0:00";
        const m = Math.floor(secs / 60);
        const s = String(Math.floor(secs % 60)).padStart(2, "0");
        return `${m}:${s}`;
    };

    const progress = duration ? currentTime / duration : 0;

    return (
        <div className={styles.player}>
            <audio
                ref={audioRef}
                src={src}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />
            <button className={styles.playButton} onClick={togglePlay}>
                {isPlaying
                    ? <Pause size={16} fill="white" color="white" />
                    : <Play size={16} fill="white" color="white" />
                }
            </button>
            <div className={styles.controls}>
                <div className={styles.waveform}>
                    {bars.map((amp, i) => (
                        <div
                            key={i}
                            className={styles.barWrapper}
                            onClick={() => handleBarClick(i)}
                        >
                            <div
                                className={styles.bar}
                                style={{
                                    height: `${amp * 100}%`,
                                    background: i / BAR_COUNT < progress
                                        ? color : isOwn ? "rgba(255,255,255, 0.3)" : "rgba(37,166,203, 0.3)"
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles.times}>
                    <span
                        style={{

                            color
                                : isOwn ? "rgba(255,255,255,0.35)" : "rgba(37,166,203)"
                        }}
                    >{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
}

export default AudioPlayer;