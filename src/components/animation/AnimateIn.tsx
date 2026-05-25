"use client";

import { domAnimation, LazyMotion, MotionConfig, m } from "framer-motion";
import { type ReactNode, useSyncExternalStore } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let observer: MutationObserver | null = null;

function subscribe(listener: Listener) {
  if (listeners.size === 0) {
    observer = new MutationObserver(() => {
      for (const l of listeners) l();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-print"],
    });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

function getSnapshot(): boolean {
  return document.documentElement.hasAttribute("data-print");
}

function getServerSnapshot(): boolean {
  return false;
}

export function AnimateIn({ children, delay = 0 }: AnimateInProps) {
  const isPrint = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (isPrint) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
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
