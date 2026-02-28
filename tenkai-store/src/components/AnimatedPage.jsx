import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // 1. On importe de quoi lire l'URL

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 50, 
    scale: 0.90, 
    filter: "blur(15px)" 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { 
      duration: 0.7, 
      type: "spring", 
      bounce: 0.4 
    }
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    scale: 1.05, 
    filter: "blur(15px)",
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export default function AnimatedPage({ children }) {
  const location = useLocation(); // 2. On récupère le chemin actuel (/rerolls, /resets...)

  return (
    <motion.div
      key={location.pathname} // 3. LE SECRET EST LÀ : La clé force l'animation au changement d'URL
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}