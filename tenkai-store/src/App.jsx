import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // <-- Import de motion ajouté ici

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HistoryDrawer from './components/HistoryDrawer';
import Footer from './components/Footer';
import PaymentOverlay from './components/PaymentOverlay';

import Home from './pages/Home';
import Category from './pages/Category';
import SubCategory from './pages/SubCategory';
import Grades from './pages/Grades';
import { storeData } from './data/store';
import { useStore } from './context/StoreContext';

// Les réglages de ton animation (Optimisée, fluide et snappée)
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 15 // Mouvement beaucoup plus subtil (15px au lieu de 50px)
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.3, // Plus de deux fois plus rapide
      ease: "easeOut" // Fini le rebond, la page arrive de manière nette et glissante
    } 
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    } 
  }
};

export default function App() {
  const location = useLocation();
  const { showLoginError, setShowLoginError } = useStore();

  useEffect(() => {
    const bgContainer = document.getElementById('dynamic-bg');
    if (!bgContainer) return;
    
    const overlay = "linear-gradient(to bottom, rgba(8, 51, 68, 0.7) 0%, rgba(3, 7, 18, 0.95) 100%), ";
    
    if (location.pathname === '/') bgContainer.style.backgroundImage = `${overlay}url('/bc1.png')`;
    else if (location.pathname.startsWith('/product/')) bgContainer.style.backgroundImage = `${overlay}url('/bc3.png')`;
    else bgContainer.style.backgroundImage = `${overlay}url('/bc2.png')`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-container">
      <div className="ambient-bg" id="dynamic-bg"></div>

      <Navbar />
      
      {/* 2. LE FANTÔME MAGIQUE EST PLACÉ ICI */}
      <PaymentOverlay /> 

      <main>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} /* ... (tes réglages d'animation) */ >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/rerolls" element={<Category title="SPOILS & REROLLS" subtitle="Choisis l'attribut que tu souhaites relancer." bgText="DESTINY" items={storeData.categories.rerolls} />} />
              <Route path="/resets" element={<Category title="RÉSURRECTION" subtitle="Que souhaites-tu réinitialiser ?" bgText="REBIRTH" items={storeData.categories.resets} />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/product/:id" element={<SubCategory />} />
              {/* PLUS BESOIN DE LA ROUTE /payment-result ! */}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <CartDrawer />
      <HistoryDrawer />

      {showLoginError && (
        <>
          <div className="drawer-overlay active" onClick={() => setShowLoginError(false)}></div>
          <div className="modal-error active">
            <h3>Accès Refusé</h3>
            <p>Veuillez vous connecter avec Steam pour lier votre compte en jeu avant d'ajouter des articles au panier.</p>
            <button className="btn-modal-close" onClick={() => setShowLoginError(false)}>Compris</button>
          </div>
        </>
      )}
    </div>
  );
}