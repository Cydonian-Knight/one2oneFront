import { useEffect, useState } from "react";
import styles from "./AdminUsersPage.module.css";
import UserTable from "./UserTable";

const USERS_URL = "https://one2onebackend.onrender.com/api/admin/users";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch(USERS_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((body) => setUsers(body.data.users))
      .catch((err) => console.error("❌ Users error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleReactivate = async (id) => {
    await fetch(`${USERS_URL}/${id}/reactivate`, {
      method: "POST",
      credentials: "include",
    });
    fetchUsers();
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Gestión de Usuarios</h2>
        <span>Administra las cuentas del sistema</span>
      </div>
      <div className={styles.content}>
        <UserTable
          initialData={users}
          loading={loading}
          onReactivate={handleReactivate}
        />
        <div className={styles.graphs}></div>
      </div>
    </div>
  );
}

export default AdminUsersPage;