import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDiscord, FaPaperPlane, FaBug, FaExclamationTriangle, FaShoppingCart, FaQuestionCircle, FaEllipsisH } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

const CATEGORIES = [
  { value: 'Bug', label: 'Bug', icon: FaBug, color: '#ff4757' },
  { value: 'Plainte', label: 'Plainte', icon: FaExclamationTriangle, color: '#FFD700' },
  { value: 'Boutique', label: 'Boutique', icon: FaShoppingCart, color: '#00E5FF' },
  { value: 'Question', label: 'Question', icon: FaQuestionCircle, color: '#c471ed' },
  { value: 'Autre', label: 'Autre', icon: FaEllipsisH, color: '#B0B5B9' }
];

export default function Modals({ isTicketModalOpen, setIsTicketModalOpen, isDiscordModalOpen, setIsDiscordModalOpen, setTickets, setActiveView }) {
  const { apiFetch, API_BASE } = useStore();
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;
    if (!newTicketCategory) { setTicketError('Veuillez sélectionner une catégorie.'); return; }

    setTicketLoading(true);
    setTicketError('');

    try {
      const res = await apiFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ title: newTicketTitle, category: newTicketCategory })
      });
      const data = await res.json();
      if (!res.ok) { setTicketError(data.error || 'Erreur lors de la création.'); return; }
      
      setTickets(prev => [data.ticket, ...prev]);
      setNewTicketTitle('');
      setNewTicketCategory('');
      setIsTicketModalOpen(false);
      setActiveView('tickets');
    } catch (err) {
      setTicketError('Erreur réseau. Réessayez.');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleDiscordLink = () => {
    window.location.href = `${API_BASE}/auth/discord`;
  };

  return (
    <>
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="tk-modal-overlay" onClick={() => setIsTicketModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="tk-liquid-glass" style={{ width: '700px', padding: '3rem', borderTop: '4px solid #ff4757', borderRadius: '32px' }}>
              <h2 className="tk-tech-font" style={{ fontSize: '2rem', marginBottom: '2rem', color: '#ff4757', textShadow: '0 0 20px rgba(255,71,87,0.4)' }}>// INITIALISER REQUÊTE</h2>
              
              <form onSubmit={handleCreateTicket}>
                <label className="tk-tech-font" style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>CATÉGORIE</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = newTicketCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setNewTicketCategory(cat.value)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 18px', borderRadius: '12px', cursor: 'pointer',
                          background: isSelected ? `${cat.color}20` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? cat.color : 'rgba(255,255,255,0.1)'}`,
                          color: isSelected ? cat.color : 'rgba(255,255,255,0.5)',
                          fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
                          transition: '0.3s', boxShadow: isSelected ? `0 0 15px ${cat.color}30` : 'none'
                        }}
                      >
                        <Icon size={14} /> {cat.label}
                      </button>
                    );
                  })}
                </div>

                <label className="tk-tech-font" style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>OBJET DE LA TRANSMISSION</label>
                <input 
                  type="text" required 
                  placeholder="Ex: Candidature Marine..." 
                  value={newTicketTitle} 
                  onChange={(e) => setNewTicketTitle(e.target.value)} 
                  maxLength={200}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '18px 20px', color: '#FFF', outline: 'none', marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} 
                  onFocus={(e)=>e.target.style.borderColor='rgba(255,71,87,0.5)'}
                  onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
                />

                {ticketError && (
                  <div style={{ color: '#ff4757', fontSize: '0.9rem', marginBottom: '1rem', padding: '10px', background: 'rgba(255,71,87,0.1)', borderRadius: '8px', border: '1px solid rgba(255,71,87,0.3)' }}>
                    {ticketError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={ticketLoading}
                  className="tk-btn-primary" 
                  style={{ 
                    width: '100%', background: ticketLoading ? 'rgba(255,71,87,0.3)' : '#ff4757', 
                    color: '#FFF', border: 'none', padding: '18px', borderRadius: '16px', 
                    fontWeight: 900, fontSize: '1.2rem', cursor: ticketLoading ? 'wait' : 'pointer', 
                    boxShadow: '0 0 30px rgba(255,71,87,0.4)', justifyContent: 'center' 
                  }}
                >
                  {ticketLoading ? 'ÉMISSION EN COURS...' : 'ÉMETTRE LE SIGNAL'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDiscordModalOpen && (
          <div className="tk-modal-overlay" onClick={() => setIsDiscordModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="tk-liquid-glass" style={{ width: '550px', textAlign: 'center', borderTop: '4px solid #5865F2', padding: '3rem', borderRadius: '32px' }}>
              <FaDiscord style={{ fontSize: '5rem', color: '#5865F2', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(88, 101, 242, 0.6))' }} />
              <h2 className="tk-tech-font" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#FFF' }}>LIAISON DISCORD</h2>
              <p className="tk-text-muted" style={{ marginBottom: '2rem', lineHeight: 1.6, fontSize: '1rem' }}>
                Liez votre compte Discord pour synchroniser votre profil et débloquer des fonctionnalités communautaires.
              </p>
              <button 
                onClick={handleDiscordLink} 
                style={{ 
                  background: '#5865F2', color: '#FFF', border: 'none', padding: '16px 30px', borderRadius: '16px', 
                  cursor: 'pointer', width: '100%', fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 0 20px rgba(88,101,242,0.4)', transition: '0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
                onMouseOver={(e)=> e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={(e)=> e.currentTarget.style.transform='translateY(0)'}
              >
                <FaDiscord /> Lier mon compte Discord
              </button>
              <button 
                onClick={() => setIsDiscordModalOpen(false)} 
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '12px', cursor: 'pointer', width: '100%', fontSize: '1rem', marginTop: '1rem', fontFamily: 'Outfit, sans-serif' }}
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
