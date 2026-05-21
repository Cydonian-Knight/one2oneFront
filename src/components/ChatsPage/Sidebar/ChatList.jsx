import ChatItem from "./ChatItem";
import { AnimatePresence, motion } from "framer-motion";

function ChatList({ chats, selectedChat, setSelectedChat, query }) {
  const unreadChats = chats?.filter(chat => chat.unreadCount > 0).length || 0;
  unreadChats > 0 ? document.title = `(${unreadChats}) One2One` : document.title = "One2One";
  return (
    <div>
      <AnimatePresence>
        {chats?.map((chat) => (
          <motion.div
            key={chat.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChatItem
              chat={chat}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              query={query}

            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ChatList;