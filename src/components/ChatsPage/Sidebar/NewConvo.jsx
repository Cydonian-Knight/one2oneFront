import { Plus } from "lucide-react";
import styles from "./NewConvo.module.css";
function NewConvo({ onClick }) {
  return (
    <button className={styles.newBtn} onClick={onClick}>
      <Plus />
      Nueva conversación
    </button>
  );
}
export default NewConvo;
