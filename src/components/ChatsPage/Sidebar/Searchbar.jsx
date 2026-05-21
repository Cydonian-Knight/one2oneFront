import styles from "./Searchbar.module.css";
import { useRef } from "react";
import { Search, User } from "lucide-react";

function Searchbar({
  placeholder = "Buscar conversación...",
  value,
  onChange,
}) {
  const inputRef = useRef(null);
  const handleClick = () => {
    if (document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div className={styles.searchbar} onClick={handleClick}>
      <Search className={styles.searchIcon} size={17} />
      <input
        type="text"
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.searchInput}
      />
    </div>
  );
}

export default Searchbar;
