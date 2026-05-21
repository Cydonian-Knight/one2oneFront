import FeatureCard from "./FeatureCard";
import { MessageCircle, Phone, Monitor, Gamepad } from "lucide-react";
import styles from "./FeatureSection.module.css";

function FeatureSection() {
  const features = [
    {
      icon: <MessageCircle size={28} />,
      title: "Mensajería instantánea",
      description:
        "Envía mensajes de texto, imágenes, audio y más en tiempo real.",
    },
    {
      icon: <Phone size={28} />,
      title: "Llamadas de voz y video",
      description: "Comunícate con llamadas de alta calidad entre usuarios.",
    },
    {
      icon: <Monitor size={28} />,
      title: "Compartir pantalla",
      description: "Comparte tu pantalla mientras hablas con otra persona",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {features.map((feature, index) => (
          <FeatureCard
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

export default FeatureSection;
