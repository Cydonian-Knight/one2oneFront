import { useState } from "react";
import { FileText, Video, Image, Eye, X, CheckCircle, XCircle, Mic } from "lucide-react";
import styles from "./ReportsTable.module.css";

const TYPE_CONFIG = {
  text: { icon: <FileText size={13} />, className: "badgeTexto", label: "Texto" },
  video: { icon: <Video size={13} />, className: "badgeVideo", label: "Video" },
  image: { icon: <Image size={13} />, className: "badgeImagen", label: "Imagen" },
  audio: { icon: <Mic size={13} />, className: "badgeAudio", label: "Audio" },
};

function Toast({ message, onClose }) {
  return (
    <div className={styles.toast}>
      <div className={styles.toastContent}>
        <p className={styles.toastTitle}>Reporte aceptado — Advertencia</p>
        <p className={styles.toastBody}>{message}</p>
      </div>
      <button className={styles.toastClose} onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

function ConfirmModal({ report, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Confirmar acción</h2>
            <p className={styles.modalMeta}>
              ¿Aceptar el reporte contra <strong>{report.reportado}</strong>?
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onCancel}>
            <X size={16} />
          </button>
        </div>
        <p className={styles.confirmText}>
          Se emitirá una advertencia (strike) a <strong>{report.reportado}</strong>. Esta acción no se puede deshacer.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnReject} onClick={onCancel}>
            <XCircle size={15} /> Cancelar
          </button>
          <button className={styles.btnAccept} onClick={onConfirm}>
            <CheckCircle size={15} /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ report, onAccept, onReject, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Revisar reporte</h2>
            <p className={styles.modalMeta}>
              <strong>{report.reporta}</strong> reportó a <strong>{report.reportado}</strong>
              &nbsp;·&nbsp;{report.fecha}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {report.mensaje && (
          <>
            <p className={styles.sectionLabel}>Mensaje</p>
            <div className={styles.mensajeBox}>
              <em>"{report.mensaje}"</em>
            </div>
          </>
        )}

        {report.media === "image" && report.mediaUrl && (
          <>
            <p className={styles.sectionLabel}>Media adjunta (imagen)</p>
            <img src={report.mediaUrl} alt="media adjunta" className={styles.mediaImg} />
          </>
        )}

        {report.media === "video" && report.mediaUrl && (
          <>
            <p className={styles.sectionLabel}>Media adjunta (video)</p>
            <video controls className={styles.mediaVideo}>
              <source src={report.mediaUrl} />
            </video>
          </>
        )}

        {report.media === "audio" && report.mediaUrl && (
          <>
            <p className={styles.sectionLabel}>Media adjunta (audio)</p>
            <audio controls className={styles.mediaAudio}>
              <source src={report.mediaUrl} />
            </audio>
          </>
        )}

        <div className={styles.modalActions}>
          <button className={styles.btnReject} onClick={onReject}>
            <XCircle size={15} /> Rechazar
          </button>
          <button className={styles.btnAccept} onClick={onAccept}>
            <CheckCircle size={15} /> Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportsTable({ data = [], loading, onResolve, onDismiss }) {
  const [reviewing, setReviewing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [toast, setToast] = useState(null);

  const handleRevisar = (row) => setReviewing(row);
  const handleCloseReview = () => setReviewing(null);

  const handleAccept = () => {
    setConfirming(reviewing);
    setReviewing(null);
  };

  const handleReject = async () => {
    await onDismiss(reviewing.id);
    setReviewing(null);
  };

  const handleConfirm = async () => {
    const user = confirming.reportado;
    await onResolve(confirming.id);
    setConfirming(null);
    setToast(`${user} tiene un nuevo strike.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCancelConfirm = () => setConfirming(null);

  if (loading) return <p style={{ padding: 20, color: "#94a3b8" }}>Cargando reportes...</p>;

  return (
    <>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Reportado</th>
              <th className={styles.th}>Reporta</th>
              <th className={styles.th}>Media</th>
              <th className={styles.th}>Fecha</th>
              <th className={`${styles.th} ${styles.right}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const config = TYPE_CONFIG[row.media] ?? TYPE_CONFIG.text;
              return (
                <tr key={row.id} className={styles.row}>
                  <td className={`${styles.td} ${styles.idCell}`}>{row.id}</td>
                  <td className={`${styles.td} ${styles.bold}`}>{row.reportado}</td>
                  <td className={`${styles.td} ${styles.muted}`}>{row.reporta}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles[config.className]}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.muted}`}>{row.fecha}</td>
                  <td className={`${styles.td} ${styles.right}`}>
                    <button className={styles.btnRevisar} onClick={() => handleRevisar(row)}>
                      <Eye size={14} /> Revisar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {reviewing && (
        <ReviewModal
          report={reviewing}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={handleCloseReview}
        />
      )}

      {confirming && (
        <ConfirmModal
          report={confirming}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

export default ReportsTable;