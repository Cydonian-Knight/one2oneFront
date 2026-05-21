import styles from "./Footer.module.css";
import { MessageCircle } from "lucide-react";
import { useIsMobile } from "../../hooks/isMobile";
function Footer() {
  const isMobile = useIsMobile(1060);

  return (
    <footer className={styles.footer}>
      <div className={styles.nameLogoContainer}>
        <div className={styles.imgContainer}>
          <MessageCircle size={28} color="white" />
        </div>
        <h3>One2One</h3>
      </div>
      <ul>
        <li>
          <a href="#inicio">Inicio</a>
        </li>
        <li>
          <a href="#caracteristicas">Características</a>
        </li>
        <li>
          <a href="#como-funciona">Cómo funciona</a>
        </li>
        <li>
          <a href="#seguridad">Seguridad</a>
        </li>
      </ul>
      <span>© 2026 One2One. Todos los derechos reservados.</span>
    </footer>
  );
}

export default Footer;
