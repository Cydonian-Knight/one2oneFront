import Header from "../../components/SettingsPage/Header";
import Sidebar from "../../components/SettingsPage/Sidebar";
import { Outlet } from "react-router-dom";
import styles from "../../components/SettingsPage/SettingsPage.module.css";
import { useState, useEffect } from "react";

const fetchCurrentUser = async () => {
  const res = await fetch("https://one2onebackend.onrender.com/api/user/info", {
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return {
    id: data.id,
    username: data.username,
    avatar: data.avatarUrl,
    age: data.edad,
    joiningDate: new Date(data.memberSince).toLocaleDateString("es-MX"),
    email: data.email,
    mood: data.mood,
    subscriptionExpiresAt: data.subscriptionExpiresAt ?? null, // 👈


  };
};

function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser().then(user => {
      if (!user) return;
      setCurrentUser(user);
    });
  }, []);

  return (
    <div className={styles.page}>
      <Header user={currentUser} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet context={{ currentUser, setCurrentUser }} />
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;