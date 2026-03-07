import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaGhost, FaBolt, FaFlask } from 'react-icons/fa';

const API_BASE = 'http://localhost:3000';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, cartTotal, removeFromCart, checkout, apiFetch, processSuccessfulPayment } = useStore();
  const [mockEnabled, setMockEnabled] = useState(false);

  useEffect(() => {
    const base = API_BASE || 'http://localhost:3000';
    fetch(`${base}/api/dev/mock-enabled`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { enabled: false })
      .then((d) => setMockEnabled(d?.enabled === true))
      .catch(() => setMockEnabled(false));
  }, []);

  const handleSimulatePurchase = async () => {
    if (cart.length === 0) return;
    try {
      const res = await apiFetch('/api/dev/simulate-purchase', { method: 'POST', body: JSON.stringify({ cart }) });
      const data = await res.json();
      if (data.success) {
        if (typeof processSuccessfulPayment === 'function') processSuccessfulPayment();
        setIsCartOpen(false);
      } else alert(data.error || 'Erreur');
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la simulation.');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-overlay active" 
            onClick={() => setIsCartOpen(false)}
            style={{ backdropFilter: 'blur(4px)' }} 
          />
        )}
      </AnimatePresence>
      
      <div 
        className={`drawer ${isCartOpen ? 'active' : ''}`} 
        id="cart-drawer"
        style={{ 
            // GLASSMORPHISM DU PANIER
            background: 'rgba(7, 11, 20, 0.55)', 
            backdropFilter: 'blur(24px)', 
            WebkitBackdropFilter: 'blur(24px)', 
            borderLeft: '1px solid rgba(0, 229, 255, 0.3)', 
            boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.6), inset 1px 0 0 rgba(255, 255, 255, 0.05)',
            display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Lueur Néon ambiante projetée dans le haut */}
        <div style={{
            position: 'absolute', top: '-10%', left: '-50%', width: '100%', height: '40%',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0
        }}></div>

        {/* --- HEADER --- */}
        <div className="drawer-header" style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFF', textShadow: '0 0 10px rgba(0, 229, 255, 0.3)' }}>
            <FaShoppingCart style={{ color: '#00E5FF', filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' }}/> Mon Panier
          </h2>
          <button 
            className="close-drawer" 
            onClick={() => setIsCartOpen(false)} 
            style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
          >✖</button>
        </div>
        
        {/* --- BODY (LISTE DES ARTICLES) --- */}
        <div className="drawer-body" style={{ padding: '0.5rem 1.5rem 2rem 1.5rem', position: 'relative', zIndex: 1, overflowY: 'auto', flexGrow: 1 }}>
          
          <AnimatePresence>
            {/* ÉTAT VIDE (Fantôme du Panier) */}
            {cart.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
                  <FaGhost style={{ fontSize: '5rem', color: 'rgba(0, 229, 255, 0.1)', filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.2))', marginBottom: '1.5rem' }}/>
                </motion.div>
                <p style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 'bold', letterSpacing: '1px' }}>Panier Vide</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem', maxWidth: '80%' }}>Remplis-le avec la puissance dont tu as besoin.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div 
                  key={index} // Idéalement item.id, mais index fonctionne ici
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -40, filter: "blur(5px)" }} // Animation de désintégration quand on retire
                  transition={{ type: 'spring', bounce: 0.4 }}
                  style={{ 
                    // CARTE DE VERRE CYAN
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 229, 255, 0.2)', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)', 
                    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0, 229, 255, 0.03)'
                  }}
                >
                  {/* Ligne Néon Cyan latérale */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
                    background: '#00E5FF', boxShadow: '0 0 15px #00E5FF'
                  }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '8px', position: 'relative', zIndex: 1 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {/* LA VRAIE IMAGE MINIATURE DANS LE PANIER */}
                      <img 
                        src={`/${item.img}`} 
                        alt="Miniature" 
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)' }}
                        onError={(e) => e.target.style.display = 'none'} // Cache l'image si elle n'existe pas
                      />
                      
                      {/* Infos Objet */}
                      <div>
                        <div style={{ color: '#FFF', fontWeight: '900', fontSize: '1.1rem', marginBottom: '4px' }}>
                          {item.name || item.title}
                        </div>
                        <div style={{ color: '#00E5FF', fontWeight: 'bold', fontSize: '1rem', textShadow: '0 0 10px rgba(0, 229, 255, 0.4)' }}>
                          {item.price?.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                    
                    {/* Bouton de suppression stylisé */}
                    <button 
                      onClick={() => removeFromCart(index)}
                      style={{ 
                          background: 'rgba(255, 71, 87, 0.1)', border: '1px solid rgba(255, 71, 87, 0.3)', 
                          color: '#ff4757', width: '36px', height: '36px', borderRadius: '10px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          transition: 'all 0.2s', backdropFilter: 'blur(5px)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#ff4757'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 71, 87, 0.5)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)'; e.currentTarget.style.color = '#ff4757'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <FaTrash size={14} />
                    </button>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* --- FOOTER DU PANIER (ZONE DE PAIEMENT) --- */}
        <div style={{ 
            padding: '1.5rem', 
            background: 'rgba(3, 7, 18, 0.8)', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(15px)',
            position: 'relative', zIndex: 2
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 'bold' }}>Total Estimé</span>
            <span style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: '900', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>
              {cartTotal.toFixed(2)} €
            </span>
          </div>

          {mockEnabled && (
            <button
              onClick={handleSimulatePurchase}
              disabled={cart.length === 0}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '12px', marginBottom: '0.8rem',
                background: cart.length === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.2)',
                color: cart.length === 0 ? '#666' : '#a855f7',
                fontWeight: '700', fontSize: '0.9rem', border: '1px solid rgba(168, 85, 247, 0.4)',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <FaFlask /> Simuler achat (sans paiement)
            </button>
          )}
          <button 
            onClick={checkout}
            disabled={cart.length === 0}
            style={{ 
                width: '100%', padding: '1.2rem', borderRadius: '12px', 
                background: cart.length === 0 ? 'rgba(255,255,255,0.05)' : '#00E5FF', 
                color: cart.length === 0 ? '#666' : '#000',
                fontWeight: '900', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px',
                border: 'none', cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: cart.length === 0 ? 'none' : '0 0 25px rgba(0, 229, 255, 0.5)',
                transition: 'all 0.3s ease',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
            }}
          >
             <FaBolt /> {cart.length === 0 ? 'Panier Vide' : 'Passer au Paiement'}
          </button>
        </div>

      </div>
    </>
  );
}