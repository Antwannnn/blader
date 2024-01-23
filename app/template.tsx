'use client'

import { AnimatePresence, motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.25}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
