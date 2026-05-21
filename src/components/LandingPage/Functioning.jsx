import FunctioningText from "./FunctioningText";
import FunctioningSection from "./FunctioningSection";
import styles from "./Functioning.module.css";

function Functioning() {
  return (
    <div className={styles.functioningMainContainer} id="como-funciona">
      <FunctioningText />
      <FunctioningSection />
    </div>
  );
}

export default Functioning;
