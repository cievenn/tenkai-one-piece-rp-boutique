import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { FaTimesCircle } from 'react-icons/fa';

export default function PaymentOverlay() {
  const store = useStore(); 
  const user = store?.user || null;
  const processSuccessfulPayment = store?.processSuccessfulPayment;
  
  const [paymentStatus, setPaymentStatus] = useState(null); 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('payment');

    if (status === 'success' || status === 'cancel') {
      setPaymentStatus(status);
      setIsVisible(true);

      if (status === 'success' && typeof processSuccessfulPayment === 'function') {
        processSuccessfulPayment();
      }

      window.history.replaceState({}, document.title, window.location.pathname);

      // LE CHRONO DYNAMIQUE : 5s pour le succès (Dopamine !), 3s pour l'annulation
      const timeToWait = status === 'success' ? 5000 : 3000;
      
      const timer = setTimeout(() => {
        setIsVisible(false); // Déclenche l'animation de fin
      }, timeToWait);

      return () => clearTimeout(timer);
    }
  }, []); 

  // LE CLIC EXTERIEUR : Force la fermeture instantanée (mais AVEC l'animation de fin !)
  const handleClose = () => { 
    if (isVisible) setIsVisible(false); 
  };
  
  const handleExitComplete = () => { setPaymentStatus(null); };

  if (!paymentStatus && !isVisible) return null;

  const isSuccess = paymentStatus === 'success';
  const themeColor = isSuccess ? '#00e676' : '#ff4757';
  const glowColor = isSuccess ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 71, 87, 0.3)';
  
  // La durée de l'animation de la barre de temps (en secondes)
  const timerDurationSec = isSuccess ? 5 : 3;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose} // Le clic dans le vide
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(10px)',
            cursor: 'pointer'
          }}
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()} // Empêche de fermer si on clique SUR la carte
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={isSuccess ? { scale: 1, y: 0, opacity: 1 } : { scale: 1, y: 0, opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
            exit={{ scale: 0.8, y: 20, opacity: 0, filter: "blur(10px)" }} // ANIMATION DE DISPARITION FLUIDE
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            style={{
              background: 'linear-gradient(145deg, #111827 0%, #030712 100%)',
              border: `1px solid ${themeColor}`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${glowColor}, inset 0 0 20px rgba(255,255,255,0.02)`,
              borderRadius: '24px', padding: '3rem', textAlign: 'center', position: 'relative',
              overflow: 'hidden', maxWidth: '450px', width: '90%', cursor: 'default'
            }}
          >
            {/* L'onde de choc Dopamine en cas de succès */}
            {isSuccess && (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  border: `4px solid ${themeColor}`, borderRadius: '24px', zIndex: 0
                }}
              />
            )}

            <div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 60%)`,
              zIndex: 0, pointerEvents: 'none', opacity: 0.6
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {isSuccess ? (
                <>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ position: 'absolute', top: -8, left: -8, right: -8, bottom: -8, borderRadius: '50%', background: themeColor, zIndex: -1 }}
                    />
                    <img 
                      src={user?.avatar || "https://i.pravatar.cc/150?img=11"} 
                      alt="Avatar" 
                      style={{ width: '85px', height: '85px', borderRadius: '50%', border: `3px solid ${themeColor}`, objectFit: 'cover', boxShadow: `0 0 20px ${glowColor}` }}
                    />
                  </div>

                  <h2 style={{ color: '#FFF', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Félicitations, <span style={{ color: themeColor, fontWeight: 900 }}>{user?.displayName || user?.discordUsername || "Pirate"}</span> !
                  </h2>
                  <motion.h1 
                    initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                    style={{ fontSize: '2.2rem', color: '#FFF', textTransform: 'uppercase', margin: '0 0 1rem 0', fontWeight: 900, textShadow: `0 0 15px ${glowColor}` }}
                  >
                    Puissance Acquise
                  </motion.h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0, lineHeight: 1.5 }}>
                    L'Haki circule en toi. Tes objets t'attendent sur Grand Line.
                  </p>
                </>
              ) : (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }} style={{ fontSize: '5rem', color: themeColor, marginBottom: '1rem', filter: `drop-shadow(0 0 15px ${themeColor})` }}>
                    <FaTimesCircle style={{ margin: '0 auto' }}/>
                  </motion.div>
                  <h1 style={{ fontSize: '2.1rem', color: '#FFF', textTransform: 'uppercase', margin: '0 0 1rem 0', fontWeight: 900 }}>
                    Transaction Annulée
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
                    Aucun berry n'a été prélevé. Ton trésor est en sécurité.
                  </p>
                </>
              )}
              
              {/* LA BARRE DE TEMPS SYNCHRONISÉE */}
              <motion.div 
                initial={{ width: "100%" }} 
                animate={{ width: "0%" }} 
                transition={{ duration: timerDurationSec, ease: "linear" }}
                style={{ height: '4px', background: themeColor, marginTop: '2.5rem', borderRadius: '2px', boxShadow: `0 0 10px ${themeColor}` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}