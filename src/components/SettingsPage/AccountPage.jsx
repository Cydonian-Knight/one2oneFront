import { Lock, Camera } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import { useOutletContext } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import styles from "./AccountPage.module.css";

function AccountPage() {
  const { currentUser, setCurrentUser } = useOutletContext();
  const [openModal, setOpenModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef(null);
  const isUploadingRef = useRef(false);

  if (!currentUser) return null;

  console.log(currentUser)
  // — Seleccionar imagen: muestra preview y abre modal de confirmación
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || isUploadingRef.current) return;
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setShowAvatarModal(true);
  }

  // — Confirmar cambio de avatar
  async function handleAvatarConfirm() {
    if (!pendingFile || isUploadingRef.current) return;
    isUploadingRef.current = true;

    const formData = new FormData();
    formData.append("avatar", pendingFile);

    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/user/newAvatar", {
        method: "POST",
        credentials: "include",
        body: formData, // sin Content-Type, el browser lo pone solo con boundary
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCurrentUser(prev => ({
        ...prev,
        avatar: `${data.data.avatar}?t=${Date.now()}`,
      }));

      toast.success("Avatar actualizado.");
    } catch (err) {
      toast.error("No se pudo actualizar el avatar.");
    } finally {
      isUploadingRef.current = false;
      setShowAvatarModal(false);
      setPendingFile(null);
      setAvatarPreview(null);
      fileInputRef.current.value = "";
    }
  }

  // — Cancelar cambio de avatar
  function handleAvatarCancel() {
    setShowAvatarModal(false);
    setPendingFile(null);
    setAvatarPreview(null);
    fileInputRef.current.value = "";
  }

  // — Guardar edad y mood
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const edad = Number(formData.get("edad"));
    const mood = formData.get("mood")?.trim();

    // VALIDACIONES
    if (!edad || edad < 18) {
      toast.error("Debes tener al menos 18 años.");
      return;
    }

    if (!mood) {
      toast.error("El mood no puede estar vacío.");
      return;
    }

    const body = {
      edad,
      mood,
    };

    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/user/newInfo", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      const data = await res.text(); // 👈 IMPORTANTE


      toast.success("Cambios guardados correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron guardar los cambios.");
    }
  }

  const displayAvatar = avatarPreview
    || currentUser.avatar
    || `https://ui-avatars.com/api/?name=${currentUser.username}`;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Datos de la Cuenta</h2>
        <span>Gestiona tu información de contacto y contraseña</span>
      </div>

      <div className={styles.userCard}>
        <div className={styles.userAvatar}>
          <img src={displayAvatar} alt="" className={styles.img} />
          <div className={styles.avatarOverlay}>
            <Camera size={20} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.username}>{currentUser.username}</span>
          <span className={styles.avtr}>Cambiar avatar</span>
        </div>
      </div>

      <form className={styles.profileInfo} onSubmit={handleSubmit}>
        <label htmlFor="edad">Edad</label>
        <input type="number" defaultValue={currentUser.age} id="edad" name="edad" />
        <label htmlFor="mood">Mood</label>
        <input type="text" defaultValue={currentUser.mood} id="mood" name="mood" />
        <label>Contraseña</label>
        <button type="button" className={styles.change} onClick={() => setOpenModal(true)}>
          <Lock size={15} />
          Cambiar contraseña
        </button>
        <button type="submit" className={styles.save}>
          Guardar cambios
        </button>
      </form>

      {/* Modal confirmación avatar */}
      {showAvatarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>¿Usar esta foto?</h3>
            <img src={avatarPreview} alt="preview" className={styles.modalPreview} />
            <div className={styles.modalButtons}>
              <button onClick={handleAvatarCancel} className={styles.cancelBtn}>Cancelar</button>
              <button onClick={handleAvatarConfirm} className={styles.confirmBtn}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {openModal && <ChangePasswordModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}

export default AccountPage;