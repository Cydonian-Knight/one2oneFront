import FunctioningCard from "./FunctioningCard";
import { UserPlus, Search, MessagesSquare } from "lucide-react";
import styles from "./FunctioningSection.module.css";

function FunctioningSection() {
  const steps = [
    {
      icon: (
        <UserPlus
          size={35}
          stroke="url(#iconGradient)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ),
      title: "Crear cuenta",
      description: "Regístrate con tu email o número de teléfono en segundos.",
    },
    {
      icon: <Search size={35} stroke="url(#iconGradient)" />,
      title: "Buscar usuarios",
      description: "Encuentra personas por su ID único o nombre de usuario.",
    },
    {
      icon: <MessagesSquare size={35} stroke="url(#iconGradient)" />,
      title: "Chetear o llamar",
      description: "Comienza a comunicarte al instante sin límites.",
    },
  ];

  return (
    <section className={styles.section}>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#21a7a9 "></stop>
            <stop offset="100%" stopColor="#387ad5"></stop>
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.container}>
        {steps.map((step, index) => (
          <FunctioningCard
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
}

export default FunctioningSection;
