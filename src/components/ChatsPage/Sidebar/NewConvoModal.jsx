import styles from "./NewConvoModal.module.css";
import Searchbar from "./Searchbar";
import { MessageCircle, X, Search } from "lucide-react";
import { useState } from "react";

function NewConvoModal({ onClose }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const isValid = search.trim().length > 0;

  const handleSearch = () => {
    if (!isValid) return;
    setLoading(true);
    setSearched(false);

    fetch("https://one2onebackend.onrender.com/api/user/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query: search.trim() })
    })
      .then(res => res.json())
      .then(data => {
        setResults(data.data.users);
        setSearched(true);
        setLoading(false);
      });
  };

  const newChat = (id) => {
    if (!id) return;
    fetch("https://one2onebackend.onrender.com/api/conversation/newConversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: id })
    })
      .then(res => res.json())
      .then(data => {
        onClose();
      });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <MessageCircle size={18} className={styles.messageIcon} />
            <h3>Nueva conversación</h3>
          </div>
          <button onClick={onClose} className={styles.closeIcon}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <span>Ingresa el nombre de usuario o correo exacto y presiona buscar</span>
          <div className={styles.searchSection}>
            <Searchbar
              placeholder="Usuario o correo exacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className={styles.searchBtn} disabled={!isValid || loading} onClick={handleSearch}>
              <Search size={18} />
            </button>
          </div>
        </div>
        <div className={styles.searchResults}>
          {!searched ? (
            <>
              <Search size={22} color="#a9b3c0" />
              <span>Escribe un nombre o correo y presiona buscar</span>
            </>
          ) : loading ? (
            <span>Buscando...</span>
          ) : results.length === 0 ? (
            <span>No se encontraron usuarios</span>
          ) : (
            results.map((user) => (

              <div
                key={user._id}
                className={`${styles.userItem} ${selectedUser?._id === user._id ? styles.active : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} className={styles.avatar} alt="" />
                <div>
                  <p>{user.username}</p>
                  <span>{user.email}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.selectUser}>
          <button className={styles.actionBtn} disabled={!selectedUser} onClick={() => newChat(selectedUser._id)}>
            Selecciona un usuario
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewConvoModal;