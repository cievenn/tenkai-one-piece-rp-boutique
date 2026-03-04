import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HistoryDrawer from './components/HistoryDrawer';
import Footer from './components/Footer';
import PaymentOverlay from './components/PaymentOverlay';

// 1. CORRECTION : IMPORT DES 3 PILIERS DU SITE
import Home from './pages/Home';
import Panel from './pages/Panel/Panel';
import Boutique from './pages/Boutique';

import { useStore } from './context/StoreContext';
import { FaExclamationTriangle } from 'react-icons/fa'; // Icône pour la belle modale d'erreur

// Réglages de l'animation ultra-fluide (avec un très léger flou directionnel)
const pageVariants = {
  initial: { opacity: 0, y: 15, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, filter: "blur(5px)", transition: { duration: 0.2, ease: "easeIn" } }
};

export default function App() {
  const location = useLocation();
  const { showLoginError, setShowLoginError } = useStore();

  useEffect(() => {
    const bgContainer = document.getElementById('dynamic-bg');
    if (!bgContainer) return;
    
    const overlay = "linear-gradient(to bottom, rgba(8, 51, 68, 0.7) 0%, rgba(3, 7, 18, 0.95) 100%), ";
    
    // Changement de fond fluide selon le pilier visité
    if (location.pathname === '/') bgContainer.style.backgroundImage = `${overlay}url('/bc1.png')`;
    else if (location.pathname === '/panel') bgContainer.style.backgroundImage = `${overlay}url('/bc2.png')`;
    else if (location.pathname === '/boutique') bgContainer.style.backgroundImage = `${overlay}url('/bc3.png')`;
    else bgContainer.style.backgroundImage = `${overlay}url('/bc1.png')`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Ajout d'une transition CSS sur le fond pour un effet de fondu entre les pages */}
      <div className="ambient-bg" id="dynamic-bg" style={{ transition: 'background-image 0.8s ease-in-out' }}></div>

      {/* 💥 CONDITION ICI : La Navbar s'affiche partout SAUF sur /panel */}
      {location.pathname !== '/panel' && <Navbar />}
      
      {/* L'overlay Holographique pour les retours de paiement Stripe */}
      <PaymentOverlay /> 

      <main>
        {/* AnimatePresence gère la destruction de l'ancienne page */}
        <AnimatePresence mode="wait">
          
          {/* 2. CORRECTION : Ajout des bonnes propriétés Framer Motion */}
          <motion.div 
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            style={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/panel" element={<Panel />} />
              <Route path="/boutique" element={<Boutique />} />
            </Routes>
          </motion.div>
          
        </AnimatePresence>
      </main>

      <Footer />
      <CartDrawer />
      <HistoryDrawer />

      {/* 3. DESIGN AMÉLIORÉ : Modale d'erreur en Glassmorphism (Alerte Rouge) */}
      <AnimatePresence>
        {showLoginError && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="drawer-overlay active" 
              onClick={() => setShowLoginError(false)}
              style={{ zIndex: 9998, backdropFilter: 'blur(8px)' }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="modal-error active"
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 9999, background: 'rgba(11, 16, 26, 0.75)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 71, 87, 0.3)', borderRadius: '20px', padding: '2.5rem',
                textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255, 71, 87, 0.05)',
                maxWidth: '400px', width: '90%'
              }}
            >
              <FaExclamationTriangle style={{ fontSize: '3rem', color: '#ff4757', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(255, 71, 87, 0.4))' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>Accès Refusé</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                Veuillez vous connecter avec Steam pour lier votre compte en jeu avant d'ajouter des articles au panier.
              </p>
              <button 
                onClick={() => setShowLoginError(false)}
                style={{
                  background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.5)', color: '#ff4757',
                  padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#ff4757'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 71, 87, 0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)'; e.currentTarget.style.color = '#ff4757'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Compris
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}