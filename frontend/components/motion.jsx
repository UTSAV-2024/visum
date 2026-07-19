import { motion, useReducedMotion } from "framer-motion";

/*
  Shared motion primitives. Every entrance enhances an already-visible
  default: reduced-motion users get content instantly with no transform.
  Easing: exponential ease-out only — no bounce, no elastic.
*/

/** @type {[number, number, number, number]} */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.3,
  ...rest
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, delay = 0, gap = 0.08, ...rest }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 18, ...rest }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
