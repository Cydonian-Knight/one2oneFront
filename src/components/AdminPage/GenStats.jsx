import {
  Users, Activity, MessageSquare,
  PhoneCall, Flag, TrendingUp, TrendingDown,
} from "lucide-react";
import styles from "./GenStats.module.css";
import GenStatsItem from "./GenStatsItem";

function GenStats({ stats }) {

  // Devuelve icono y color según si el growth es positivo, negativo o neutro
  function trendIcon(growth) {
    if (growth > 0) return <TrendingUp size={15} color="#25b15f" />;
    if (growth < 0) return <TrendingDown size={15} color="#dc2828" />;
    return null;
  }

  function trendLabel(growth) {
    if (growth === 0) return "0%";
    return growth > 0 ? `+${growth}%` : `${growth}%`;
  }

  function fmt(n) {
    return n?.toLocaleString("es-MX") ?? "—";
  }

  const items = [
    {
      icon: <Users size={23} color="#1dafa1" />,
      number: fmt(stats?.users.total),
      label: "Usuarios totales",
      valueIcon: trendIcon(stats?.users.growth),
      value: trendLabel(stats?.users.growth),
    },
    {
      icon: <Activity size={23} color="#25b15f" />,
      number: fmt(stats?.activeUsers.total),
      label: "Usuarios activos",
      valueIcon: trendIcon(stats?.activeUsers.growth),
      value: trendLabel(stats?.activeUsers.growth),
    },
    {
      icon: <MessageSquare size={23} color="#4962df" />,
      number: fmt(stats?.messages.total),
      label: "Mensajes hoy",
      valueIcon: trendIcon(stats?.messages.growth),
      value: trendLabel(stats?.messages.growth),
    },
    {
      icon: <PhoneCall size={23} color="#1dafa1" />,
      number: fmt(stats?.calls.total),
      label: "Llamadas hoy",
      valueIcon: trendIcon(stats?.calls.growth),
      value: trendLabel(stats?.calls.growth),
    },
    {
      icon: <Flag size={23} color="#dc2828" />,
      number: fmt(stats?.reports.pending),
      label: "Reportes pendientes",
      valueIcon: null,
      value: null,
    },
    {
      icon: <PhoneCall size={23} color="#6366f1" />,
      number: fmt(stats?.callMinutes.voice),
      label: "Minutos de voz hoy",
      valueIcon: null,
      value: null,
    },
    {
      icon: <PhoneCall size={23} color="#f59e0b" />,
      number: fmt(stats?.callMinutes.video),
      label: "Minutos de video hoy",
      valueIcon: null,
      value: null,
    },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <GenStatsItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          number={item.number}
          value={item.value}
          valueIcon={item.valueIcon}
        />
      ))}
    </div>
  );
}

export default GenStats;