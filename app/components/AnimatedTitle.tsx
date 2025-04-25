'use client';

import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
}

export default function AnimatedTitle({ title, subtitle }: AnimatedTitleProps) {
  return (
    <div className="text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
            {title}
          </span>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform origin-left"></div>
        </h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] opacity-30 bg-primary/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
} 