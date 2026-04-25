"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
}

function readPrintMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute("data-print");
}

export function AnimateIn({ children, delay = 0 }: AnimateInProps) {
  const shouldReduce = useReducedMotion();
  const [isPrint, setIsPrint] = useState<boolean>(readPrintMode);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    setIsPrint(readPrintMode());
    const observer = new MutationObserver(() => {
      setIsPrint(readPrintMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-print"],
    });
    return () => observer.disconnect();
  }, []);

  // When rendering as plain <div>, clear any residual inline style left over
  // from SSR'd motion.div output (opacity:0;transform:translateY(16px)).
  useEffect(() => {
    if ((shouldReduce || isPrint) && ref.current) {
      ref.current.removeAttribute("style");
    }
  }, [shouldReduce, isPrint]);

  if (shouldReduce || isPrint) {
    return (
      <div ref={ref} suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
