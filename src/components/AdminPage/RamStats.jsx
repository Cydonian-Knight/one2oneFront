import { Cpu, HardDrive, MemoryStick } from "lucide-react";
import styles from "./RamStats.module.css";
import RamStatsItem from "./RamStatsItem";

function RamStats({ current }) {
  const items = [
    {
      label: "CPU",
      number: current ? `${current.cpu}%` : "--",
      icon: <Cpu size={30} color="#aadfc1" />,
    },
    {
      label: "RAM",
      number: current ? `${current.ram.heapUsed} MB` : "--",
      icon: <MemoryStick size={30} color="#aadfc1" />,
    },
    {
      label: "DISCO",
      number: current ? `${current.disk}%` : "--",
      icon: <HardDrive size={30} color="#aadfc1" />,
    },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <RamStatsItem
          key={item.label}
          label={item.label}
          number={item.number}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

export default RamStats;