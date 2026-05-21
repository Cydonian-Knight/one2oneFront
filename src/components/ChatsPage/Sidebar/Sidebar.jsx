import styles from "./Sidebar.module.css";
import UserHeader from "./UserHeader";
import Searchbar from "./Searchbar";
import ChatList from "./ChatList";
import UserSettingsModal from "./UserSettingsModal";
import { useState, useRef, useEffect } from "react";
import NewConvoModal from "./NewConvoModal";
import NewConvo from "./NewConvo";

function Sidebar({ currentUser, chats, selectedChat, setSelectedChat, onOpenModal }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");  // ← nuevo
  const ref = useRef(null);

  const filteredChats = query.trim()
    ? chats.filter(c =>
      c.contact?.username?.toLowerCase().includes(query.toLowerCase())
    )
    : chats;

  return (
    <div className={styles.sidebar}>
      <div className={styles.top}>
        <div ref={ref} className={styles.headerArea}>
          <div className={styles.headerContainer} onClick={() => setOpen(!open)}>
            {currentUser && <UserHeader user={currentUser} />}
          </div>
          {open && <UserSettingsModal />}
        </div>
        <Searchbar
          value={query}
          onChange={(e) => setQuery(e.target.value)}  // ← conectado
        />
      </div>
      <div className={styles.bottom}>
        <ChatList
          chats={filteredChats}  // ← filtrado
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          query={query}
        />
      </div>
      <div className={styles.newConvo}>
        <NewConvo onClick={onOpenModal} />
      </div>
    </div>
  );
}
export default Sidebar;