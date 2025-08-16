"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const AnimatedCard = ({ 
  children, 
  className, 
  delay = 0, 
  hover = true 
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      whileHover={hover ? { 
        y: -5, 
        transition: { duration: 0.2 } 
      } : {}}
      className={cn(
        "relative rounded-xl border border-white/[0.2] bg-black/[0.05] backdrop-blur-sm",
        "dark:bg-black/[0.96] dark:border-white/[0.1]",
        "overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      {children}
    </motion.div>
  );
};