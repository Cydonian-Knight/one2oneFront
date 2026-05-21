import { Mic, Mail, Video } from "lucide-react";
import styles from "./SentStats.module.css";
import SentStatsItem from "./SentStatsItem";

function fmtMinutes(seconds) {
  if (!seconds) return "0.0 min";
  return `${(seconds / 60).toFixed(1)} min`;
}
function SentStats({ stats }) {
  const items = [
    {
      label: "Minutos de voz hoy",
      number: fmtMinutes(stats?.callMinutes?.voice),
      icon: <Mic size={25} color="#1fb0a2" />,
      bgColor: "#e8f7f5",
    },
    {
      label: "Minutos de video hoy",
      number: fmtMinutes(stats?.callMinutes?.video),
      icon: <Video size={25} color="#4962df" />,
      bgColor: "#eceffb",
    },
    {
      label: "SMS enviados hoy",
      number: 0,
      icon: <Mail size={25} color="#25b15f" />,
      bgColor: "#e9f7ef",
    },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <SentStatsItem
          key={item.label}
          label={item.label}
          number={item.number}
          icon={item.icon}
          bgColor={item.bgColor}
        />
      ))}
    </div>
  );
}

export default SentStats;