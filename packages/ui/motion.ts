export const motionVariants = {
  resolveIn: {
    initial: { opacity: 0, scale: 0.96, filter: "blur(12px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  heroResolve: {
    initial: { opacity: 0, scale: 0.88, filter: "blur(16px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
  sheetSlide: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
    transition: { type: "spring", stiffness: 280, damping: 32 },
  },
  glowPulse: {
    animate: {
      boxShadow: [
        "0 0 0px rgba(41,240,224,0)",
        "0 0 24px rgba(41,240,224,0.35)",
        "0 0 0px rgba(41,240,224,0)",
      ],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
  },
  staggerContainer: {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  },
  staggerFast: {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  },
  orbitItem: {
    initial: { opacity: 0, scale: 0.6, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  float: {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    },
  },
  breathe: {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [0.85, 1, 0.85],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  },
  lineDraw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

export const springSnappy = { type: "spring" as const, stiffness: 400, damping: 28 };
export const springSoft = { type: "spring" as const, stiffness: 200, damping: 26 };
