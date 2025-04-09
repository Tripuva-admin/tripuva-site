import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'filled' | 'outlined';
  color?: 'blue' | 'green' | 'red' | 'amber';
  className?: string;
  open: boolean;
  onClose?: () => void;
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    filled: 'bg-blue-500',
    outlined: 'border-blue-500 text-blue-500',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    filled: 'bg-green-500',
    outlined: 'border-green-500 text-green-500',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    filled: 'bg-red-500',
    outlined: 'border-red-500 text-red-500',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    filled: 'bg-amber-500',
    outlined: 'border-amber-500 text-amber-500',
  },
};

export function Alert({
  children,
  variant = 'gradient',
  color = 'blue',
  className = '',
  open,
  onClose,
}: AlertProps) {
  const baseClasses = 'rounded-lg p-4 shadow-lg text-white';
  const variantClasses = variant === 'gradient' 
    ? `bg-gradient-to-r ${colorClasses[color].gradient}`
    : variant === 'filled'
    ? colorClasses[color].filled
    : `border ${colorClasses[color].outlined}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`${baseClasses} ${variantClasses} ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 