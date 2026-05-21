import { Mic, Video, Mail, DollarSign } from "lucide-react";
import styles from "./ProviderStats.module.css";
import ProviderStatsItem from "./ProviderStatsItem";

const VOICE_RATE = 0.013;  // $ por minuto
const VIDEO_RATE = 0.015;
const SMS_RATE = 0.0075;

function ProviderStats({ metrics = [], loading }) {
  const totals = metrics.reduce(
    (acc, m) => ({
      voice: acc.voice + (m.voiceMinutes ?? 0),
      video: acc.video + (m.videoMinutes ?? 0),
      sms: acc.sms + (m.smsCount ?? 0),
    }),
    { voice: 0, video: 0, sms: 0 }
  );
  console.log("metrics:", metrics);       // ve si llega el array
  console.log("totals:", totals);         // ve si suma bien

  const cost = (
    totals.voice * VOICE_RATE +
    totals.video * VIDEO_RATE +
    totals.sms * SMS_RATE
  ).toFixed(2);

  const items = [
    {
      icon: <Mic size={23} color="#1dafa1" />,
      number: totals.voice.toLocaleString(),
      label: "Total Voz (min)",
    },
    {
      icon: <Video size={23} color="#4962df" />,
      number: totals.video.toLocaleString(),
      label: "Total Video (min)",
    },
    {
      icon: <Mail size={23} color="#25b15f" />,
      number: totals.sms.toLocaleString(),
      label: "Total SMS",
    },
    {
      icon: <DollarSign size={23} color="#d97706" />,
      number: `$${cost}`,
      label: "Costo estimado",
    },
  ];

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <ProviderStatsItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          number={item.number}
        />
      ))}
    </div>
  );
}

export default ProviderStats;