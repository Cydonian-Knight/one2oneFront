import styles from "./Message.module.css";
import { ChevronDown, Trash2, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MessageActions({ messageId, conversationId, isOwn, onDeleteMessage, onReportMessage, isDeleted, isReported }) {
    if (isDeleted || isReported) return null;
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    const toggleMenu = (e) => {
        e.stopPropagation();

        setOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const closeMenu = () => {
            setOpen(false);
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        window.addEventListener(
            "scroll",
            closeMenu,
            true
        );

        window.addEventListener(
            "wheel",
            closeMenu,
            { passive: true }
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            window.removeEventListener(
                "scroll",
                closeMenu,
                true
            );

            window.removeEventListener(
                "wheel",
                closeMenu
            );
        };
    }, []);

    const handleDelete = () => {
        onDeleteMessage({ messageId, conversationId });
        setOpen(false);
    };

    const handleReport = () => {
        onReportMessage({ messageId, conversationId });
        setOpen(false);
    };

    return (

        <div
            ref={dropdownRef}
            className={`${styles.action} ${open ? styles.actionOpen : ""
                }`}
        >
            <ChevronDown
                size={25}
                onClick={toggleMenu}
            />

            {open && (
                <div
                    className={styles.dropdown}
                    style={isOwn ? { right: 0 } : { left: 0 }}
                >
                    {isOwn ? (
                        <button
                            className={styles.dropdownButton}
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} />
                            Borrar mensaje
                        </button>
                    ) : (
                        <button
                            className={styles.dropdownButton}
                            onClick={handleReport}
                        >
                            <TriangleAlert size={16} />
                            Reportar mensaje
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default MessageActions;
