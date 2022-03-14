import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function MotionDiv({ children, type = "appear", ...props }) {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants[type]}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const variants = {
  appear: {
    hidden: {
      opacity: 0,
      top: "100vh",
      scale: 0,
    },
    visible: { opacity: 1, top: "0", scale: 1, transition: { duration: 1 } },
  },
  slideLeft: {
    hidden: {
      opacity: 0,
      left: "100vw",
      scale: 0,
    },
    visible: { opacity: 1, left: "0", scale: 1, transition: { duration: 1 } },
  },
  slideRight: {
    hidden: {
      opacity: 0,
      right: "100vw",
      scale: 0,
    },
    visible: {
      opacity: 1,
      right: "0",
      scale: 1,
      transition: { duration: 1 },
    },
  },
  slideUp: {
    hidden: {
      opacity: 1,
      bottom: "100vh",
      scale: 0,
    },
    visible: {
      opacity: 1,
      bottom: "0",
      scale: 1,
      transition: { duration: 2 },
    },
  },
};
