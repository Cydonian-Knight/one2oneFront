import styles from "../../components/UserPage/UserProfilePage.module.css";
import StatusDot from "../../components/ChatsPage/StatusDot";
import BlockUserModal from "../../components/UserPage/BlockUserModal";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  Ban,
  Flag,
  ShieldAlert,
} from "lucide-react";

function UserProfile({ user, onClose, blockUser, unblockUser, conversationId }) {
  const [openModal, setOpenModal] = useState(false);
  const [openBlockedModal, setOpenBlockedModal] = useState(false);
  const isBlocked = user?.isBlocked || false;
  const blockedYou = user?.blockedYou || false;
  function handleUnblock() {
    unblockUser({ conversationId, contactId: user.id }); // 👈 en vez de socket directo
  }

  function handleBlockUser() {
    setOpenModal(false);
  }
  console.log(user);


  return (
    <div className={styles.profile}>
      <div className={styles.banner}>
        <button onClick={onClose} className={styles.close}>
          <ArrowLeft size={19} />
        </button>
      </div>

      <div className={styles.container}>
        {isBlocked || blockedYou ? (
          <>
            <div className={styles.title}>
              <div className={styles.avatarContainer}>
                <img src={user.avatar || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} className={styles.avatarBlocked} />
                <StatusDot size={16} bottom={6} right={6} isBlocked={true} />
              </div>
            </div>
            <div className={styles.userDescription}>
              <h2>{user.username}</h2>
              <span className={styles.statusBlocked}>
                {isBlocked && "Has bloqueado a este usuario"}
                {blockedYou && "Este usuario te ha bloqueado"}
              </span>
              <div className={styles.subBlocked}>
                <Ban size={16} />
                Bloqueado
              </div>
            </div>
            <div className={styles.blockedContainer}>
              <div className={styles.blockedCard}>
                <div className={styles.blockedIcon}>
                  <ShieldAlert size={25} color="#e13933" />
                </div>
                <h3>Usuario bloqueado</h3>
                <span>
                  No recibirás mensajes ni llamadas de {user.username}. Tampoco
                  podrás ver su estado en línea.
                </span>
              </div>
              {isBlocked
                &&
                <div className={styles.blockedButtons}>
                  <button className={styles.unblockButton} onClick={handleUnblock}>
                    <ShieldAlert size={16} />
                    Desbloquear usuario
                  </button>
                </div>
              }

            </div>
          </>
        ) : (
          <>
            <div className={styles.title}>
              <div className={styles.avatarContainer}>
                <img src={user.avatar || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`} className={styles.avatar} />
                <StatusDot
                  isOnline={user.isOnline}
                  size={16}
                  bottom={6}
                  right={6}
                />
              </div>
            </div>

            <div className={styles.userDescription}>
              <h2>{user.username}</h2>
              <h2>
                {user.mood ? `🧠 ~${user.mood}~` : "Sin estado"}

              </h2>
              {
                user.isOnline ?
                  <span className={styles.status}>
                    "En línea"
                  </span> :
                  <span className={styles.statusOff}>
                    "Desconectado"
                  </span>
              }

            </div>
            <div className={styles.infoCard}>
              <div className={styles.cardItem}>
                <div className={styles.cardIcon}>
                  <Mail size={18} />
                </div>
                <div className={styles.cardText}>
                  <span className={styles.ti}>Email</span>
                  <span className={styles.sub}>{user.email}</span>
                </div>
              </div>
              <div className={styles.cardItem}>
                <div className={styles.cardIcon}>
                  <User size={18} />
                </div>
                <div className={styles.cardText}>
                  <span className={styles.ti}>Edad</span>
                  <span className={styles.sub}>{user.age || "Sin edad Registrada"}</span>
                </div>
              </div>
              <div className={styles.cardItem}>
                <div className={styles.cardIcon}>
                  <Calendar size={18} />
                </div>
                <div className={styles.cardText}>
                  <span className={styles.ti}>Se unió</span>
                  <span className={styles.sub}>{user.createdAt}</span>
                </div>
              </div>
              <div className={styles.cardItem}>
                <div className={styles.cardIcon}>
                  <Clock size={18} />
                </div>
                <div className={styles.cardText}>
                  <span className={styles.ti}>Última vez</span>
                  <span className={styles.sub}>
                    {user.isOnline
                      ?
                      "En línea"
                      :
                      new Date(user.lastSeenAt).toLocaleString('es-MX', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button type="button" onClick={() => setOpenModal(true)}>
                <Ban size={16} />
                Bloquear usuario
              </button>

              {openModal && (
                <BlockUserModal
                  user={user}
                  onClose={() => setOpenModal(false)}
                  onConfirm={handleBlockUser}
                  blockUser={blockUser}
                  conversationId={conversationId}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
