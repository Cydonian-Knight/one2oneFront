import styles from "./MainBanner.module.css";
import { useNavigate } from "react-router-dom";

function MainBanner() {
  const navigate = useNavigate();
  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.title}>Empieza a comunicarte hoy con One2One</h2>
      <p className={styles.description}>
        Únete a miles de personas que ya disfrutan de mensajería segura,
        llamadas de calidad y privacidad total.
      </p>
      <div className={styles.btnsContainer}>
        <button onClick={() => navigate("/auth/register")}>Crear Cuenta</button>
        <button onClick={() => navigate("/auth/login")}>Iniciar sesión</button>
      </div>
    </div>
  );
}

export default MainBanner;
