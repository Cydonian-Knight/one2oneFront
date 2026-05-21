import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./ResourceChart.module.css";

const CustomTooltip = ({ active, payload, label, unit = "%" }) => {
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
            <span className={styles.value}>
              {entry.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function ResourceChart({
  title,
  data,
  // Single-series props (backward compatible)
  dataKey,
  color,
  // Multi-series prop
  series,
  yTicks = [0, 25, 50, 75, 100],
  unit = "%",
}) {
  // Normalize to always work with an array of series
  const resolvedSeries = series ?? [{ dataKey, color }];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            {resolvedSeries.map(({ dataKey: key, color: c }) => (
              <linearGradient
                key={key}
                id={`color-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                <stop offset="95%" stopColor={c} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            interval={4}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            ticks={yTicks}
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />

          {resolvedSeries.map(({ dataKey: key, color: c }) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={c}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${key})`}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ResourceChart;
