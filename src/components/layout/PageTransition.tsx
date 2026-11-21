import React from 'react';
import { motion, Variants } from 'motion/react';

/**
 * Premium cinematic fade-in-up page transition variants.
 * Uses hardware-accelerated transforms and opacity with an editorial deceleration curve
 * matching high-end automotive and industrial technology presentations.
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.996,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier deceleration
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.998,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 0.9, 1],
    },
  },
};

interface PageTransitionProps {
  pageKey: string;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ pageKey, children }) => {
  return (
    <motion.div
      key={pageKey}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
};
