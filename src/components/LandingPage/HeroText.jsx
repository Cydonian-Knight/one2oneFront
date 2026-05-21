import styles from "./HeroText.module.css";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/isMobile";
import { useNavigate } from "react-router-dom";

function HeroText() {
  const isMobile = useIsMobile(1060);
  const navigate = useNavigate();

  return (
    <div className={styles.mainContainer}>
      <p className={styles.titleParagraph}>
        <h1 className={styles.comH1}>Comunicación 1 a 1</h1>
        <h1>
          <span className={styles.limitH1}>sin límites.</span>
        </h1>
      </p>

      <p className={styles.paragraph}>
        Plataforma gratuita para chatear, llamar y conectarte con
        {isMobile ? "" : <br />}
        cualquier persona en tiempo real
      </p>
      <div className={styles.buttonContainer}>
        <button
          className={styles.registerBtn}
          onClick={() => navigate("/auth/register")}
        >
          Crear cuenta
        </button>
        <button
          className={styles.loginBtn}
          onClick={() => navigate("/auth/login")}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default HeroText;
