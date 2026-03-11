"use client";
import React, { useId } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}) => {
  const {
    id,
    className,
    background,
    minSize = 0.4,
    maxSize = 1,
    speed = 1,
    particleColor = "#ffffff",
    particleDensity = 100,
  } = props;
  
  const [isMounted, setIsMounted] = useState(false);
  const generatedId = useId();

  // We are going to use a simpler implementation for the sparkles to avoid tsParticles errors in strict mode
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const generatedParticles = Array.from({ length: particleDensity }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * (10 / speed) + 5,
      delay: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, [particleDensity, maxSize, minSize, speed, isMounted]);

  if (!isMounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {background && (
        <div 
           className="absolute inset-0 pointer-events-none" 
           style={{ backgroundColor: background }} 
        />
      )}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: particleColor,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [p.opacity / 2, p.opacity, p.opacity / 2],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
