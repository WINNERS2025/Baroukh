import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GameCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GameCard({ children, className = '', delay = 0 }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
      className={`bg-white/85 backdrop-blur-sm rounded-3xl border-4 border-parchment-200 shadow-parchment p-6 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
