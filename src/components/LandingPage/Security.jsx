import styles from "./Features.module.css";
import SecurityText from "./SecurityText";
import SecuritySection from "./SecuritySection";

function Security() {
  return (
    <div className={styles.featuresMainContainer} id="seguridad">
      <SecurityText />
      <SecuritySection />
    </div>
  );
}

export default Security;
