import styles from "./ChangePasswordModal.module.css";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa todos los campos");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña nueva debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/user/newPass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ old: currentPassword, new: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al actualizar la contraseña");
        return;
      }

      toast.success("Contraseña actualizada correctamente");
      onClose();
    } catch {
      toast.error("Error de conexión, intenta de nuevo");
    }
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.title}>
          <h3>Cambiar contraseña</h3>
          <span>Ingresa tu contraseña actual y la nueva contraseña</span>
        </div>

        <form className={styles.changePassword} onSubmit={handleSubmit}>
          <label>Contraseña actual</label>
          <div className={styles.inputWrapper}>
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <label>Nueva contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <label>Confirmar nueva contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.save}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
