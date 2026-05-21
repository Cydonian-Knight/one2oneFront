import { Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { currentUser } = useOutletContext();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (currentUser) setAvatar(currentUser.avatar);
  }, [currentUser]);

  function handleChangeAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  }

  if (!currentUser) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Perfil</h2>
        <span>Información visible para otros usuarios</span>
      </div>
      <div className={styles.userCard}>

        <div className={styles.userAvatar} style={{ cursor: "auto" }}>
          <img src={avatar || `https://ui-avatars.com/api/?name=${currentUser.username}`} alt="" className={styles.img} />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.username}>{currentUser.username}</span>
          <span className={styles.avtr}>{currentUser.mood || `Sin estado`}</span>
        </div>
      </div>
      <div className={styles.profileInfo}>
        <label htmlFor="username">Username</label>
        <input type="text" disabled placeholder={currentUser.username} id="username" />
        <label htmlFor="email">Email</label>
        <input type="text" disabled placeholder={currentUser.email} id="email" />
        <label>Cuenta creada</label>
        <span className={styles.join}>{currentUser.joiningDate || "Error"}</span>
      </div>
    </div>
  );
}

export default ProfilePage;