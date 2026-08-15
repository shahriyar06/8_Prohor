"use client";
import { useEffect, useState } from "react";

const WATCH_NAMES = [
  "Deep Night",
  "Before Dawn",
  "Sunrise",
  "Forenoon",
  "Midday",
  "Afternoon",
  "Dusk",
  "Evening",
];

export default function ProhorDial() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setNow(new Date()), 60 * 1000); // প্রতি মিনিটে আপডেট
    return () => clearInterval(interval);
  }, []);

  // Server-এ কিছুই render করবো না (বা placeholder), শুধু client mount হওয়ার পর আসল dial দেখাবো
  if (!mounted) {
    return <div className="w-[260px] h-[260px]" />; // একই সাইজের খালি placeholder, layout shift এড়াতে
  }

  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const radius = 96;
  const center = 120;

  const hourFloat = now.getHours() + now.getMinutes() / 60;
  const activeSegment = Math.floor(hourFloat / 3);
  const handAngle = (hourFloat / 24) * 360 - 90;
  const progressAngle = (hourFloat / 24) * 360;

  const ticks = Array.from({ length: 24 });

  const describeArc = (r: number, endAngleDeg: number) => {
    const startRad = (-90 * Math.PI) / 180;
    const endRad = ((-90 + endAngleDeg) * Math.PI) / 180;
    const x1 = center + r * Math.cos(startRad);
    const y1 = center + r * Math.sin(startRad);
    const x2 = center + r * Math.cos(endRad);
    const y2 = center + r * Math.sin(endRad);
    const largeArc = endAngleDeg > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative w-[260px] h-[260px]">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <path d={describeArc(radius - 2, progressAngle)} fill="#8b5cf6" fillOpacity={0.06} />

        <circle cx={center} cy={center} r={radius + 20} fill="none" stroke="#a78bfa" strokeOpacity={0.15} strokeWidth={1} />
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#a78bfa" strokeOpacity={0.3} strokeWidth={1} />
        <circle cx={center} cy={center} r={radius - 40} fill="none" stroke="#a78bfa" strokeOpacity={0.1} strokeWidth={0.5} strokeDasharray="1 4" />

        {ticks.map((_, i) => {
          const angle = (360 / 24) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const isMajor = i % 3 === 0;
          const innerR = isMajor ? radius - 14 : radius - 6;
          return (
            <line
              key={i}
              x1={center + radius * Math.cos(rad)}
              y1={center + radius * Math.sin(rad)}
              x2={center + innerR * Math.cos(rad)}
              y2={center + innerR * Math.sin(rad)}
              stroke="#a78bfa"
              strokeOpacity={isMajor ? 0.7 : 0.25}
              strokeWidth={isMajor ? 1.5 : 0.75}
            />
          );
        })}

        {romans.map((label, i) => {
          const angle = (360 / 8) * i - 90 + 360 / 16;
          const rad = (angle * Math.PI) / 180;
          const labelR = radius - 30;
          const isActive = i === activeSegment;
          return (
            <text
              key={i}
              x={center + labelR * Math.cos(rad)}
              y={center + labelR * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="11"
              fill={isActive ? "#8b5cf6" : "#a78bfa"}
              opacity={isActive ? 1 : 0.45}
            >
              {label}
            </text>
          );
        })}

        <g opacity={0.5}>
          <line x1={center} y1={center - radius - 20} x2={center} y2={center - radius - 12} stroke="#a78bfa" strokeWidth={1} />
          <polygon
            points={`${center},${center - radius - 24} ${center - 3},${center - radius - 18} ${center + 3},${center - radius - 18}`}
            fill="#a78bfa"
          />
        </g>

        <line
          x1={center}
          y1={center}
          x2={center + (radius - 22) * Math.cos((handAngle * Math.PI) / 180)}
          y2={center + (radius - 22) * Math.sin((handAngle * Math.PI) / 180)}
          stroke="#8b5cf6"
          strokeWidth={1.5}
        />
        <circle cx={center} cy={center} r={2.5} fill="#8b5cf6" />
        <circle cx={center} cy={center} r={5} fill="none" stroke="#8b5cf6" strokeOpacity={0.4} strokeWidth={0.75} />
      </svg>

      <div className="absolute -bottom-9 left-0 right-0 text-center">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#a78bfa]">
          Watch {romans[activeSegment]} — {WATCH_NAMES[activeSegment]}
        </p>
        <p className="font-mono text-[9px] tracking-[0.1em] text-[#a78bfa]/50 mt-0.5">
          {Math.round((hourFloat / 24) * 100)}% of day elapsed
        </p>
      </div>
    </div>
  );
}