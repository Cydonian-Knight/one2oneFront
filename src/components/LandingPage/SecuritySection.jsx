import SecurityCard from "./SecurityCard";
import { TriangleAlert, Shield, Lock, UserCheck } from "lucide-react";
import styles from "./SecuritySection.module.css";

function SecuritySection() {
  const features = [
    {
      icon: <TriangleAlert size={28} />,
      title: "Reporte de mensajes",
      description: "Reporta contenido inapropiado en un solo click.",
    },
    {
      icon: <Shield size={28} />,
      title: "Sistema de penalizaciones",
      description: "Sanciones automáticas según el comportamiento del usuario.",
    },
    {
      icon: <Lock size={28} />,
      title: "Bloqueo de usuarios",
      description:
        "Bloquea a cualquier otro usuario para dejar de recibir mensajes.",
    },
    {
      icon: <UserCheck size={28} />,
      title: "Verificación en dos pasos",
      description: "Protege tu cuenta con autenticación 2FA.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {features.map((feature, index) => (
          <SecurityCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

export default SecuritySection;
