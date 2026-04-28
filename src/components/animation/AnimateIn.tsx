"use client";

import { domAnimation, LazyMotion, MotionConfig, m } from "framer-motion";
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
  const [isPrint, setIsPrint] = useState<boolean>(false);
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

  const skipAnimation = isPrint;

  if (skipAnimation) {
    return (
      <div ref={ref} suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
