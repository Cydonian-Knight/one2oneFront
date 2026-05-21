// ServerResourcesGraph.jsx
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import styles from "./ServerResourcesGraph.module.css";

// ── TOOLTIP ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltipContainer}>
      <p className={styles.tooltipLabel}>{label}</p>
      <div className={styles.tooltipList}>
        {payload.map((entry, i) => (
          <div key={i} className={styles.tooltipItem}>
            <div className={styles.tooltipInfo}>
              <div
                className={styles.tooltipIndicator}
                style={{ backgroundColor: entry.stroke }}
              />
              <span className={styles.tooltipName}>
                {entry.dataKey.toUpperCase()} %
              </span>
            </div>
            <span className={styles.tooltipValue}>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── HELPERS ───────────────────────────────────────────────────

// Un punto por hora: se queda con el último snapshot de cada hora
function filterByHour(history) {
  const byHour = new Map();

  for (const snapshot of history) {
    const date = new Date(snapshot.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    byHour.set(key, snapshot); // sobreescribe → último del intervalo
  }

  return Array.from(byHour.values());
}

// Convierte un snapshot del backend al formato que espera Recharts
function toChartPoint(snapshot) {
  const date = new Date(snapshot.timestamp);
  const time = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const cpu = parseFloat(snapshot.cpu) || 0;

  const heapUsed = parseFloat(snapshot.ram?.heapUsed) || 0;
  const heapTotal = parseFloat(snapshot.ram?.heapTotal) || 1;
  const ram = parseFloat(((heapUsed / heapTotal) * 100).toFixed(2));

  return { time, cpu, ram };
}

// ── COMPONENTE ────────────────────────────────────────────────
function ServerResourcesGraph({ history = [] }) {
  console.log("📈 history recibido:", history.length, history[0]); // ← agrega esto

  const data = filterByHour(history).map(toChartPoint);
  const chartData = data.length ? data : [{ time: "--:--", cpu: 0, ram: 0 }];

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h3>Recursos del Servidor</h3>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            interval={Math.max(1, Math.floor(chartData.length / 12))}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="cpu"
            stroke="#14b8a6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCpu)"
            activeDot={{ r: 5, strokeWidth: 0, fill: "#14b8a6" }}
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="ram"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRam)"
            activeDot={{ r: 5, strokeWidth: 0, fill: "#6366f1" }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ServerResourcesGraph;