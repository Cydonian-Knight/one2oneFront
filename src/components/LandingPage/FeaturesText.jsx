import styles from "./FeaturesText.module.css";
import { useIsMobile } from "../../hooks/isMobile";


function FeaturesText() {
  const isMobile = useIsMobile(1060);

  return (
    <div className={styles.featuresTitle}>
      <h2>Características
        principales</h2>
      <p>
        Todo lo que necesitas para comunicarte de forma privada, rápida y segura
      </p>
    </div>
  );
}

export default FeaturesText;
