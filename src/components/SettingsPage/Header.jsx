import { ArrowLeft } from "lucide-react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  function handleReturn() {
    navigate("/chat");
  }
  return (
    <div className={styles.container}>
      <button onClick={handleReturn}>
        <ArrowLeft size={18} />
      </button>
      Configuración
    </div>
  );
}
export default Header;
