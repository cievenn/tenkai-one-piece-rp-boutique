import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTerminal, FaPaperPlane } from 'react-icons/fa';

export default function TicketsView({ variants, tickets, setTickets, currentUser, searchQuery, setIsTicketModalOpen }) {
  const filteredTickets = tickets.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery));
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const [newMsg, setNewMsg] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedTicket) return;
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return { ...t, messages: [...t.messages, { sender: currentUser.pseudo, text: newMsg, time: "À l'instant", isMe: true }] };
      }
      return t;
    });
    setTickets(updatedTickets);
    setNewMsg('');
  };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="view-container" style={{ display: 'flex', gap: '2.5rem' }}>
      
      <div style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
        <button onClick={() => setIsTicketModalOpen(true)} className="tk-btn-secondary" style={{ padding: '25px', borderRadius: '24px', fontSize: '1.3rem', justifyContent: 'center', color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)' }} onMouseOver={(e)=>{e.currentTarget.style.background='#ff4757'; e.currentTarget.style.color='#FFF'}} onMouseOut={(e)=>{e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color='#ff4757'}}>
          <FaPlus /> INITIALISER UN CANAL
        </button>
        
        <div className="tk-scroll-zone-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredTickets.map(t => (
            <div key={t.id} onClick={() => setSelectedTicketId(t.id)} style={{ padding: '1.8rem', borderRadius: '24px', background: selectedTicket?.id === t.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedTicket?.id === t.id ? '#00E5FF' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: '0.3s', boxShadow: selectedTicket?.id === t.id ? 'inset 1px 1px 2px rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="tk-tech-font" style={{ color: selectedTicket?.id === t.id ? '#00E5FF' : '#B0B5B9', fontSize: '1.3rem', fontWeight: 'bold' }}>{t.id}</span>
                <span className="tk-text-muted" style={{ fontSize: '0.9rem' }}>{t.date}</span>
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.15rem', color: '#FFF', marginBottom: '20px', lineHeight: 1.4 }}>{t.title}</div>
              <div className={`tk-badge ${t.status === 'ouvert' ? 'tk-badge-staff' : 'tk-badge-success'}`} style={{ display: 'inline-block' }}>
                {t.status === 'ouvert' ? 'EN ATTENTE ADMIN' : 'RÉSOLU'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tk-liquid-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '30px' }}>
        {selectedTicket ? (
          <>
            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
              <h3 className="tk-text-metal" style={{ fontSize: '1.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>LIAISON SÉCURISÉE <span style={{color: '#00E5FF'}}>{selectedTicket.id}</span></h3>
            </div>
            
            <div className="tk-scroll-zone-main" style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {selectedTicket.messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                  <span className="tk-text-muted" style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>{msg.sender} • {msg.time}</span>
                  <div className={`tk-chat-bubble ${msg.isMe ? 'tk-chat-me' : 'tk-chat-other'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '2rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                 <FaTerminal style={{ position: 'absolute', top: '22px', left: '25px', color: '#00E5FF', fontSize: '1.2rem' }} />
                 <input type="text" placeholder="Répondre à l'administration..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px 20px 20px 60px', color: '#FFF', outline: 'none', fontFamily: 'Inter', fontSize: '1.15rem', transition: '0.3s' }} onFocus={(e)=>e.target.style.borderColor='#00E5FF'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
              </div>
              <button type="submit" className="tk-btn-primary" style={{ padding: '0 40px', borderRadius: '20px', fontSize: '1.5rem' }}><FaPaperPlane /></button>
            </form>
          </>
        ) : (
          <div className="tk-tech-font" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0B5B9', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '2px' }}>SÉLECTIONNEZ UNE REQUÊTE</div>
        )}
      </div>
    </motion.div>
  );
}