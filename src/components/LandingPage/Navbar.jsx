import styles from "./Navbar.module.css";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/isMobile";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(1060);
  const [open, setOpen] = useState(false);

  const menuItems = (
    <>
      <ul>
        <li>
          <a href="#inicio" onClick={() => setOpen(false)}>
            Inicio
          </a>
        </li>
        <li>
          <a href="#caracteristicas" onClick={() => setOpen(false)}>
            Características
          </a>
        </li>
        <li>
          <a href="#como-funciona" onClick={() => setOpen(false)}>
            Cómo funciona
          </a>
        </li>
        <li>
          <a href="#seguridad" onClick={() => setOpen(false)}>
            Seguridad
          </a>
        </li>
      </ul>
      <div className={styles.navbarButtonContainer}>
        <button
          className={styles.navbarLoginBtn}
          onClick={() => navigate("/auth/login")}
        >
          Iniciar sesión
        </button>
        <button
          className={styles.navbarRegisterBtn}
          onClick={() => navigate("/auth/register")}
        >
          Crear cuenta
        </button>
      </div>
    </>
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.nameLogoContainer}>
        <div className={styles.navbarImgContainer}>
          <MessageCircle size={28} color="white" />
        </div>
        <h2>One2One</h2>
      </div>
      {isMobile ? (
        <>
          <button
            className={styles.burguerButton}
            onClick={() => setOpen(!open)}
          >
            {open ? "✖" : "☰"}
          </button>

          {open && <div className={styles.dropdownBurguer}>{menuItems}</div>}
        </>
      ) : (
        <>{menuItems}</>
      )}
    </nav>
  );
}

export default Navbar;
