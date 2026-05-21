import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import styles from "./ProviderConsumptionChart.module.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{label}</p>
        <div className={styles.tooltipList}>
          {payload.map((entry, index) => (
            <div key={index} className={styles.tooltipItem}>
              <div className={styles.tooltipInfo}>
                <div
                  className={styles.tooltipIndicator}
                  style={{ backgroundColor: entry.fill }}
                />
                <span className={styles.tooltipName}>{entry.name}</span>
              </div>
              <span className={styles.tooltipValue}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

function ProviderConsumptionChart({ title, metrics = [] }) {
  const chartData = metrics.map((m) => ({
    day: m.date.slice(5),        // "2026-05-11" → "05-11"
    voiceMinutes: m.voiceMinutes,
    videoMinutes: m.videoMinutes,
    smsCount: m.smsCount,
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={8}
        >
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "#f1f5f9", opacity: 0.5 }}
          />
          <Bar name="Voz (min)" dataKey="voiceMinutes" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={20} activeBar={{ fill: "#0d9488" }} />
          <Bar name="Video (min)" dataKey="videoMinutes" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={20} activeBar={{ fill: "#4f46e5" }} />
          <Bar name="SMS" dataKey="smsCount" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={20} activeBar={{ fill: "#16a34a" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProviderConsumptionChart;