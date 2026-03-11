"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-transparent z-0 pointer-events-none w-full h-full",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent z-10 w-full h-full" />
      <div
        className="absolute -inset-x-0 bottom-0 h-[150%] w-full bg-brand/30 opacity-20 [mask-image:radial-gradient(100%_100%_at_bottom_center,white,transparent)] z-0 block translate-y-[20%]"
        style={{
          background: "radial-gradient(circle at center, #163A5C 0%, transparent 60%)",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-50 z-0 mix-blend-screen pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="radialSearchPattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="1"
                  className="fill-brand/40"
                ></circle>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#radialSearchPattern)"
            ></rect>
          </svg>
      </div>
    </div>
  );
};
