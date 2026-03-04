import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDiscord, FaPaperPlane } from 'react-icons/fa';

export default function Modals({ isTicketModalOpen, setIsTicketModalOpen, isDiscordModalOpen, setIsDiscordModalOpen, setTickets, setActiveView }) {
  const [newTicketTitle, setNewTicketTitle] = useState('');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;
    const ticket = { 
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`, 
      title: newTicketTitle, 
      status: "ouvert", 
      type: "support", 
      date: "À l'instant", 
      messages: [] 
    };
    setTickets(prev => [ticket, ...prev]);
    setNewTicketTitle('');
    setIsTicketModalOpen(false);
    setActiveView('tickets');
  };

  return (
    <>
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="tk-modal-overlay" onClick={() => setIsTicketModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="tk-liquid-glass" style={{ width: '700px', padding: '4rem', borderTop: '4px solid #ff4757', borderRadius: '32px' }}>
              <h2 className="tk-tech-font" style={{ fontSize: '3rem', marginBottom: '2.5rem', color: '#ff4757', textShadow: '0 0 20px rgba(255,71,87,0.4)' }}>// INITIALISER REQUÊTE</h2>
              <form onSubmit={handleCreateTicket}>
                <label className="tk-tech-font" style={{ display: 'block', marginBottom: '15px', color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem' }}>OBJET DE LA TRANSMISSION</label>
                <input type="text" required placeholder="Ex: Candidature Marine..." value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '25px', color: '#FFF', outline: 'none', marginBottom: '3.5rem', fontSize: '1.3rem', fontFamily: 'Inter' }} />
                <button type="submit" className="tk-btn-primary" style={{ width: '100%', background: '#ff4757', color: '#FFF', border: 'none', padding: '25px', borderRadius: '20px', fontWeight: 900, fontSize: '1.6rem', cursor: 'pointer', boxShadow: '0 0 30px rgba(255,71,87,0.4)', justifyContent: 'center' }}>
                  ÉMETTRE LE SIGNAL
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDiscordModalOpen && (
          <div className="tk-modal-overlay" onClick={() => setIsDiscordModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="tk-liquid-glass" style={{ width: '550px', textAlign: 'center', borderTop: '4px solid #5865F2', padding: '4rem', borderRadius: '32px' }}>
              <FaDiscord style={{ fontSize: '7rem', color: '#5865F2', marginBottom: '2rem', filter: 'drop-shadow(0 0 30px rgba(88, 101, 242, 0.6))' }} />
              <h2 className="tk-tech-font" style={{ fontSize: '2.8rem', marginBottom: '1.5rem', color: '#FFF' }}>LIAISON DISCORD</h2>
              <p className="tk-text-muted" style={{ marginBottom: '3rem', lineHeight: 1.6, fontSize: '1.2rem' }}>Le protocole de communication externe a été initié. Vérifiez votre application Discord.</p>
              <button onClick={() => setIsDiscordModalOpen(false)} className="tk-btn-primary" style={{ background: '#5865F2', color: '#FFF', border: 'none', padding: '20px 40px', borderRadius: '20px', cursor: 'pointer', width: '100%', fontSize: '1.6rem', justifyContent: 'center' }}>FERMER LA FENÊTRE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}