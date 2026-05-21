import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./ProviderConsChart.module.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className={styles.tooltipItem}>
            <div
              className={styles.indicator}
              style={{ backgroundColor: entry.color }}
            />
            <span className={styles.tooltipKey}>{entry.name}:</span>
            <span className={styles.value}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function ProviderConsChart({ title = "Consumo por Día", metrics = [] }) {
  const data = metrics.map((m) => ({
    date: m.date.slice(5),         // "2026-05-11" → "05-11"
    voz: m.voiceMinutes,
    video: m.videoMinutes,
    sms: m.smsCount,
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="voz" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Voz" />
          <Bar dataKey="video" fill="#6366f1" radius={[3, 3, 0, 0]} name="Video" />
          <Bar dataKey="sms" fill="#22c55e" radius={[3, 3, 0, 0]} name="SMS" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProviderConsChart;