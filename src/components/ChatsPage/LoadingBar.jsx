import styles from "./StatusBar.module.css";

function StatusBar({ progress }) {
    console.log(progress);
    return (
        <div
            className={styles.bar}
            style={{ "--progress": `${progress}%` }}
        />
    );
}

export default StatusBar;