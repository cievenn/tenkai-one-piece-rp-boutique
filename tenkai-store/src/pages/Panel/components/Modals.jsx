import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDiscord, FaBug, FaExclamationTriangle, FaShoppingCart, FaQuestionCircle, FaEllipsisH, FaUserShield, FaSkull, FaGavel, FaBan, FaLightbulb } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

const CATEGORY_ICONS = {
  'Candidature RP': FaUserShield, 'Demande RPK': FaSkull, 'Plainte Joueur': FaExclamationTriangle,
  'Plainte Staff': FaGavel, 'Bug Report': FaBug, 'Boutique': FaShoppingCart,
  'Unban': FaBan, 'Question': FaQuestionCircle, 'Suggestion': FaLightbulb, 'Autre': FaEllipsisH
};

const CATEGORY_COLORS = {
  'Candidature RP': '#00E5FF', 'Demande RPK': '#ff4757', 'Plainte Joueur': '#FFD700',
  'Plainte Staff': '#ff6b81', 'Bug Report': '#ff4757', 'Boutique': '#00E5FF',
  'Unban': '#c471ed', 'Question': '#c471ed', 'Suggestion': '#00e676', 'Autre': '#B0B5B9'
};

export default function Modals({ isTicketModalOpen, setIsTicketModalOpen, isDiscordModalOpen, setIsDiscordModalOpen, setTickets, setActiveView, preselectedCategory, setPreselectedCategory }) {
  const { apiFetch, API_BASE } = useStore();
  const [categories, setCategories] = useState([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('');
  const [ticketError, setTicketError] = useState('');
  const [ticketLoading, setTicketLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiFetch('/api/tickets/categories');
        if (res.ok) { const d = await res.json(); setCategories(d.categories); }
      } catch {}
    };
    loadCategories();
  }, [apiFetch]);

  useEffect(() => {
    if (preselectedCategory && isTicketModalOpen) {
      setNewTicketCategory(preselectedCategory);
    }
  }, [preselectedCategory, isTicketModalOpen]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;
    if (!newTicketCategory) { setTicketError('Veuillez sélectionner une catégorie.'); return; }
    setTicketLoading(true); setTicketError('');
    try {
      const res = await apiFetch('/api/tickets', { method: 'POST', body: JSON.stringify({ title: newTicketTitle, category: newTicketCategory }) });
      const data = await res.json();
      if (!res.ok) { setTicketError(data.error || 'Erreur lors de la création.'); return; }
      setTickets(prev => [data.ticket, ...prev]);
      setNewTicketTitle(''); setNewTicketCategory(''); setPreselectedCategory('');
      setIsTicketModalOpen(false); setActiveView('tickets');
    } catch { setTicketError('Erreur réseau. Réessayez.'); }
    finally { setTicketLoading(false); }
  };

  const handleClose = () => {
    setIsTicketModalOpen(false); setNewTicketTitle(''); setNewTicketCategory(''); setTicketError(''); setPreselectedCategory('');
  };

  return (
    <>
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="tk-modal-overlay" onClick={handleClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="tk-liquid-glass" style={{ width: '750px', maxHeight: '85vh', overflow: 'auto', padding: '2.5rem', borderTop: '4px solid #ff4757', borderRadius: '32px' }}>
              <h2 className="tk-tech-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#ff4757', textShadow: '0 0 20px rgba(255,71,87,0.4)' }}>// INITIALISER REQUÊTE</h2>
              
              <form onSubmit={handleCreateTicket}>
                <label className="tk-tech-font" style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>TYPE DE REQUÊTE</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
                  {categories.map(cat => {
                    const Icon = CATEGORY_ICONS[cat.value] || FaEllipsisH;
                    const color = CATEGORY_COLORS[cat.value] || '#B0B5B9';
                    const isSelected = newTicketCategory === cat.value;
                    return (
                      <button key={cat.value} type="button" onClick={() => setNewTicketCategory(cat.value)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                        background: isSelected ? `${color}15` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? color : 'rgba(255,255,255,0.06)'}`,
                        color: isSelected ? color : 'rgba(255,255,255,0.5)',
                        fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', transition: '0.2s',
                        boxShadow: isSelected ? `0 0 12px ${color}20` : 'none'
                      }}>
                        <Icon size={16} style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{cat.value}</div>
                          <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400, marginTop: '2px' }}>{cat.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <label className="tk-tech-font" style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>OBJET</label>
                <input type="text" required placeholder="Décrivez brièvement votre demande..." value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} maxLength={200} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 16px', color: '#FFF', outline: 'none', marginBottom: '1.2rem', fontSize: '1rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} onFocus={(e)=>e.target.style.borderColor='rgba(255,71,87,0.5)'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />

                {ticketError && <div style={{ color: '#ff4757', fontSize: '0.85rem', marginBottom: '1rem', padding: '10px', background: 'rgba(255,71,87,0.1)', borderRadius: '8px', border: '1px solid rgba(255,71,87,0.3)' }}>{ticketError}</div>}

                <button type="submit" disabled={ticketLoading} className="tk-btn-primary" style={{ width: '100%', background: ticketLoading ? 'rgba(255,71,87,0.3)' : '#ff4757', color: '#FFF', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: 900, fontSize: '1.1rem', cursor: ticketLoading ? 'wait' : 'pointer', boxShadow: '0 0 25px rgba(255,71,87,0.4)', justifyContent: 'center' }}>
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
              <h2 className="tk-tech-font" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#FFF' }}>DISCORD TENKAI</h2>
              <p className="tk-text-muted" style={{ marginBottom: '2rem', lineHeight: 1.6, fontSize: '1rem' }}>Rejoignez notre communauté Discord pour rester informé des dernières actualités.</p>
              <button onClick={() => setIsDiscordModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: '12px', cursor: 'pointer', width: '100%', fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>Fermer</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
