'use client'

import { motion } from 'framer-motion'

interface AnimateInProps {
  children: React.ReactNode
  delay?: number
}

export function AnimateIn({ children, delay = 0 }: AnimateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
