"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RiskGauge({
  score = 0,
  size = 180,
  label = "Risk Score",
}: {
  score?: number;
  size?: number;
  label?: string;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s <= 25) return "#10b981"; // green
    if (s <= 50) return "#3b82f6"; // blue
    if (s <= 75) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const getRiskLabel = (s: number) => {
    if (s <= 25) return "Low Risk";
    if (s <= 50) return "Medium-Low";
    if (s <= 75) return "Medium-High";
    return "High Risk";
  };

  const color = getColor(animatedScore);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl" style={{ width: size }}>
      <svg viewBox="0 0 160 100" className="w-full h-auto overflow-visible">
        {/* Background Arc */}
        <path
          d="M 10 90 A 70 70 0 0 1 150 90"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Value Arc Filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Value Arc */}
        <motion.path
          d="M 10 90 A 70 70 0 0 1 150 90"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          filter="url(#glow)"
        />
        <text
          x="80"
          y="72"
          textAnchor="middle"
          className="text-4xl font-bold font-sans"
          fill={color}
          style={{ textShadow: `0 0 10px ${color}80` }}
        >
          {animatedScore}
        </text>
        <text
          x="80"
          y="88"
          textAnchor="middle"
          className="text-xs font-semibold uppercase tracking-wider"
          fill="#94a3b8"
        >
          {getRiskLabel(animatedScore)}
        </text>
      </svg>
      {label && (
        <div className="mt-2 text-sm font-medium text-gray-400">
          {label}
        </div>
      )}
    </div>
  );
}
