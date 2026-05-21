import { useState } from "react";
import { Search, Shield, X, CheckCircle, XCircle } from "lucide-react";
import styles from "./UserTable.module.css";

const ESTADO_CONFIG = {
  Activo: { className: "estadoActivo" },
  Suspendido: { className: "estadoSuspendido" },
  Bloqueado: { className: "estadoBaneado" },
};

function Toast({ message, onClose }) {
  return (
    <div className={styles.toast}>
      <div className={styles.toastContent}>
        <p className={styles.toastTitle}>Usuario reactivado</p>
        <p className={styles.toastBody}>{message}</p>
      </div>
      <button className={styles.toastClose} onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

function ConfirmModal({ user, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Reactivar usuario</h2>
            <p className={styles.modalMeta}>
              Confirmar reactivación de <strong>{user.username}</strong>
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onCancel}>
            <X size={16} />
          </button>
        </div>
        <p className={styles.confirmText}>
          La cuenta de <strong>{user.username}</strong> volverá al estado{" "}
          <strong>Activo</strong>. Sus restricciones actuales serán levantadas.
          ¿Deseas continuar?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.btnReject} onClick={onCancel}>
            <XCircle size={15} /> Cancelar
          </button>
          <button className={styles.btnAccept} onClick={onConfirm}>
            <CheckCircle size={15} /> Reactivar
          </button>
        </div>
      </div>
    </div>
  );
}

function UserTable({ initialData = [], loading, onReactivate }) {
  const [search, setSearch] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = initialData.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = async () => {
    await onReactivate(confirming.id);
    setToast(`${confirming.username} ahora está activo nuevamente.`);
    setConfirming(null);
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) return <p style={{ padding: 20, color: "#94a3b8" }}>Cargando usuarios...</p>;

  return (
    <>
      <div className={styles.searchWrapper}>
        <Search size={15} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Usuario</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Strikes</th>
              <th className={styles.th}>Estado</th>
              <th className={styles.th}>Último acceso</th>
              <th className={`${styles.th} ${styles.right}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const estadoCfg = ESTADO_CONFIG[row.estado] ?? ESTADO_CONFIG.Activo;
              const canReactivate = row.estado === "Suspendido" || row.estado === "Bloqueado";
              return (
                <tr key={row.id} className={styles.row}>
                  <td className={styles.td}>
                    <div className={styles.userCell}>
                      <img src={row.avatar || `https://ui-avatars.com/api/?name=${row.username}`} alt={row.username} className={styles.avatar} />

                      <span className={styles.bold}>{row.username}</span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.muted}`}>{row.email}</td>
                  <td className={styles.td}>
                    {row.strikes > 0
                      ? <span className={styles.strikeBadge}>{row.strikes}</span>
                      : <span className={styles.muted}>0</span>
                    }
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.estadoBadge} ${styles[estadoCfg.className]}`}>
                      {row.estado}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.muted}`}>{row.ultimoAcceso}</td>
                  <td className={`${styles.td} ${styles.right}`}>
                    {canReactivate ? (
                      <button className={styles.btnReactivar} onClick={() => setConfirming(row)}>
                        <Shield size={14} /> Reactivar
                      </button>
                    ) : (
                      <span className={styles.noAction}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirming && (
        <ConfirmModal
          user={confirming}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

export default UserTable;