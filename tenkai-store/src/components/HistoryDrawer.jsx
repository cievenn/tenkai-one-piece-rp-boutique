import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxOpen, FaCheckCircle, FaGhost } from 'react-icons/fa';

export default function HistoryDrawer() {
  const { isHistoryOpen, setIsHistoryOpen, history } = useStore();

  return (
    <>
      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-overlay active" 
            onClick={() => setIsHistoryOpen(false)}
            style={{ backdropFilter: 'blur(4px)' }} // Léger flou sur le fond du site
          />
        )}
      </AnimatePresence>
      
      <div 
        className={`drawer ${isHistoryOpen ? 'active' : ''}`} 
        id="history-drawer"
        style={{ 
            // LE GLASSMORPHISM ABSOLU DU TIROIR
            background: 'rgba(7, 11, 20, 0.55)', // Noir bleuté très transparent
            backdropFilter: 'blur(24px)', // Le flou intense (verre)
            WebkitBackdropFilter: 'blur(24px)', // Pour Safari
            borderLeft: '1px solid rgba(0, 229, 255, 0.2)', // Bordure lumineuse Cyan
            boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.6), inset 1px 0 0 rgba(255, 255, 255, 0.05)' // Ombre et reflet interne du verre
        }}
      >
        {/* Lueur Néon ambiante projetée dans le haut du tiroir */}
        <div style={{
            position: 'absolute', top: '-10%', right: '-50%', width: '100%', height: '40%',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0
        }}></div>

        <div className="drawer-header" style={{ position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFF', textShadow: '0 0 10px rgba(0, 229, 255, 0.3)' }}>
            <FaBoxOpen style={{ color: '#00E5FF', filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' }}/> Mon Coffre
          </h2>
          <button 
            className="close-drawer" 
            onClick={() => setIsHistoryOpen(false)} 
            style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}
          >✖</button>
        </div>
        
        <div className="drawer-body" style={{ padding: '0.5rem 1.5rem 2rem 1.5rem', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
          
          <AnimatePresence>
            {/* --- ÉTAT VIDE (FANTÔME FLOTTANT) --- */}
            {isHistoryOpen && history.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Animation de lévitation du fantôme */}
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                  <FaGhost style={{ fontSize: '5rem', color: 'rgba(0, 229, 255, 0.1)', filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.2))', marginBottom: '1.5rem' }}/>
                </motion.div>
                <p style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 'bold', letterSpacing: '1px' }}>Coffre Vide</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem', maxWidth: '80%' }}>Ton héritage s'écrira ici lorsque tu auras acquis de la puissance.</p>
              </motion.div>
            )}

            {/* --- LISTE DES ACHATS (CARTES DE VERRE) --- */}
            {isHistoryOpen && history.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {history.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, type: 'spring', bounce: 0.4 }}
                    style={{ 
                      // GLASSMORPHISM SUR LES CARTES D'ACHAT
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)', 
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(0, 230, 118, 0.15)', // Bordure verte fine
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Reflet de lumière en haut
                      borderLeft: '1px solid rgba(255, 255, 255, 0.05)', // Reflet de lumière à gauche
                      borderRadius: '16px',
                      padding: '1.2rem 1.5rem',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0, 230, 118, 0.02)'
                    }}
                  >
                    {/* Ligne Néon Verte latérale */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
                      background: '#00e676', boxShadow: '0 0 15px #00e676'
                    }}></div>

                    {/* Tache de lumière verte enfouie dans le verre de la carte */}
                    <div style={{
                        position: 'absolute', bottom: '-20px', right: '-20px', width: '70px', height: '70px',
                        background: 'rgba(0, 230, 118, 0.15)', filter: 'blur(20px)', borderRadius: '50%'
                    }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px', position: 'relative', zIndex: 1 }}>
                      
                      {/* Infos Produit */}
                      <div>
                        <div style={{ color: '#FFF', fontWeight: '900', fontSize: '1.15rem', marginBottom: '4px', letterSpacing: '0.5px' }}>
                          {item.name || item.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                          {item.date}
                        </div>
                      </div>
                      
                      {/* Infos Prix et Validation */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#00e676', fontWeight: '900', fontSize: '1.25rem', textShadow: '0 0 10px rgba(0, 230, 118, 0.3)' }}>
                          {item.price?.toFixed(2)} €
                        </div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#00e676', 
                            display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', 
                            marginTop: '6px', fontWeight: 'bold', textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                          <FaCheckCircle style={{ filter: 'drop-shadow(0 0 5px rgba(0, 230, 118, 0.8))' }}/> Validé
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}