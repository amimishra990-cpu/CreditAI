"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export function CountUp({
  to,
  duration = 2,
  className = "",
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });
  
  const display = useTransform(spring, (current) => {
    return `${prefix}${Math.round(current)}${suffix}`;
  });

  useEffect(() => {
    spring.set(to);
  }, [spring, to]);

  return <motion.span className={className}>{display}</motion.span>;
}
