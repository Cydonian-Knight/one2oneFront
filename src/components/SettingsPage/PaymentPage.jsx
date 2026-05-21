import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Lock, Crown, CheckCircle, XCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import styles from "./AccountPage.module.css";

const PLANS = [
  {
    id: "monthly",
    label: "1 mes",
    price: "$49.99 MXN",
    description: "$49.99 / mes",
    highlight: false,
  },
  {
    id: "biannual",
    label: "6 meses",
    price: "$249.99 MXN",
    description: "$41.67 / mes",
    highlight: true,
  },
  {
    id: "annual",
    label: "Anual",
    price: "$449.99 MXN",
    description: "$37.50 / mes",
    highlight: false,
  },
];

function PaymentPage() {
  const { currentUser, setCurrentUser } = useOutletContext();
  const [loading, setLoading] = useState(null);
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState(null);
  const activatedRef = useRef(false);

  useEffect(() => {
    if (currentUser?.subscriptionExpiresAt) {
      setSubscriptionExpiresAt(new Date(currentUser.subscriptionExpiresAt));
    } else {
      setSubscriptionExpiresAt(null);
    }
  }, [currentUser]);

  const isActive = subscriptionExpiresAt && subscriptionExpiresAt > new Date();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");

    if (params.get("checkout") === "success" && plan) {
      if (activatedRef.current) return;
      activatedRef.current = true;

      fetch("https://one2onebackend.onrender.com/api/stripe/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.subscriptionExpiresAt) {
            const newExpiry = new Date(data.subscriptionExpiresAt);
            setSubscriptionExpiresAt(newExpiry);
            setCurrentUser((prev) => ({ ...prev, subscriptionExpiresAt: newExpiry }));
            toast.success("¡Bienvenido a Premium! 🎉");
          }
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch(() => toast.error("Error al activar, contacta soporte."));
    }

    if (params.get("checkout") === "cancelled") {
      toast("Pago cancelado.", { icon: "ℹ️" });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function handleCheckout(planId) {
    setLoading(planId);
    try {
      const res = await fetch("https://one2onebackend.onrender.com/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan: planId }),
      });

      if (!res.ok) throw new Error("Error al crear la sesión de pago");

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      toast.error("No se pudo iniciar el pago. Intenta de nuevo.");
      setLoading(null);
    }
  }

  function formatDate(date) {
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div className={styles.nameLogoContainer}>
            <div className={styles.navbarImgContainer}>
              <Crown size={28} color="white" />
            </div>
          </div>
          <div>
            <h2>Pasarse a premium</h2>
            <span>Desbloquea todas las funciones de One2One</span>
          </div>
        </div>
      </div>

      <div className={`${styles.subscriptionStatus} ${isActive ? styles.statusActive : styles.statusInactive}`}>
        {isActive ? (
          <>
            <CheckCircle size={16} />
            <span>
              Suscripción activa — vence el <strong>{formatDate(subscriptionExpiresAt)}</strong>
            </span>
          </>
        ) : (
          <>
            <XCircle size={16} />
            <span>
              {subscriptionExpiresAt
                ? `Tu suscripción venció el ${formatDate(subscriptionExpiresAt)}`
                : "No tienes una suscripción activa"}
            </span>
          </>
        )}
      </div>

      <div className={styles.plansGrid}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.highlight ? styles.featured : ""}`}
          >
            {plan.highlight && <span className={styles.badge}>Más popular</span>}
            <h3 className={styles.planName}>{plan.label}</h3>
            <p className={styles.planPrice}>{plan.price}</p>
            <p className={styles.planDescription}>{plan.description}</p>
            <button
              className={plan.highlight ? styles.btnPrimary : styles.btnSecondary}
              onClick={() => handleCheckout(plan.id)}
              disabled={loading !== null}
            >
              {loading === plan.id
                ? "Redirigiendo…"
                : isActive
                  ? `Extender ${plan.label.toLowerCase()}`
                  : `Elegir ${plan.label.toLowerCase()}`}
            </button>
          </div>
        ))}
      </div>

      <p className={styles.secureNote}>
        <Lock size={13} />
        Pagos procesados de forma segura por Stripe
      </p>
    </div>
  );
}

export default PaymentPage;