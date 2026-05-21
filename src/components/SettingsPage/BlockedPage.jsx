import styles from "./BlockedPage.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import BlockedItem from "./BlockedItem";
import UnblockModal from "./UnblockModal";
function BlockedPage() {
  const [users, setUsers] = useState([
    {
      username: "jorge_m",
      icon: "https://plus.unsplash.com/premium_photo-1705134294276-c06083b6c071?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      email: "jorge@email.com",
    },
    {
      username: "pao_jes_her",
      icon: "https://scontent.fpbc1-1.fna.fbcdn.net/v/t39.30808-6/473192864_1347506709935993_841664952607479314_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=53a332&_nc_ohc=rMQLqNPKroEQ7kNvwE6FwoJ&_nc_oc=AdpSbaUCF14t5ZA7lDfC8uw4LJmVDZZolw3q5vKsRi7ULX9XlDptEKKrx-sk7urouVY&_nc_zt=23&_nc_ht=scontent.fpbc1-1.fna&_nc_gid=LXidErCxN08prCdrtqTkUA&_nc_ss=7b2a8&oh=00_Af5VRD-LXlYHnoWewoHGWYKecZ4lnrCGtXhqY9ypQZ8LRQ&oe=6A02B652",
      email: "pao@gmail.com",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

  function handleUnblock() {
    setUsers((prev) =>
      prev.filter((user) => user.username !== selectedUser.username)
    );

    toast.success(`${selectedUser.username} fue desbloqueado exitosamente`);

    setSelectedUser(null);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>Usuarios bloqueados</h2>
          <span>Usuarios que has bloqueado no podrán contactarte</span>
        </div>

        <div className={styles.blockedUsers}>
          {users.map((item) => (
            <BlockedItem
              key={item.username}
              username={item.username}
              icon={item.icon}
              email={item.email}
              onUnblock={() => setSelectedUser(item)}
            />
          ))}
        </div>
      </div>

      {selectedUser && (
        <UnblockModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onConfirm={handleUnblock}
        />
      )}
    </>
  );
}

export default BlockedPage;
