import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTerminal, FaPaperPlane, FaCircle } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

const STATUS_STYLES = {
  'Ouvert': { bg: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', border: 'rgba(0, 229, 255, 0.3)' },
  'En attente': { bg: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', border: 'rgba(255, 215, 0, 0.3)' },
  'Fermé': { bg: 'rgba(0, 230, 118, 0.1)', color: '#00e676', border: 'rgba(0, 230, 118, 0.3)' }
};

const CATEGORY_COLORS = {
  'Bug': '#ff4757',
  'Plainte': '#FFD700',
  'Boutique': '#00E5FF',
  'Question': '#c471ed',
  'Autre': '#B0B5B9'
};

export default function TicketsView({ variants, tickets, setTickets, searchQuery, setIsTicketModalOpen }) {
  const { apiFetch, user } = useStore();
  const filteredTickets = tickets.filter(t => 
    (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.ticket_uid || '').includes(searchQuery)
  );
  const [selectedTicketUid, setSelectedTicketUid] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (filteredTickets.length > 0 && !selectedTicketUid) {
      setSelectedTicketUid(filteredTickets[0].ticket_uid);
    }
  }, [filteredTickets, selectedTicketUid]);

  useEffect(() => {
    if (!selectedTicketUid) { setSelectedTicket(null); setMessages([]); return; }
    
    const loadTicket = async () => {
      try {
        const res = await apiFetch(`/api/tickets/${selectedTicketUid}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedTicket(data.ticket);
          setMessages(data.ticket.messages || []);
        }
      } catch (err) { console.error('Error loading ticket:', err); }
    };
    loadTicket();
  }, [selectedTicketUid, apiFetch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedTicket || sending) return;
    if (selectedTicket.status === 'Fermé') return;

    setSending(true);
    try {
      const res = await apiFetch(`/api/tickets/${selectedTicketUid}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: newMsg })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setNewMsg('');
      }
    } catch (err) { console.error('Error sending message:', err); }
    finally { setSending(false); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="view-container" style={{ display: 'flex', gap: '2rem' }}>
      
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', flexShrink: 0 }}>
        <button onClick={() => setIsTicketModalOpen(true)} className="tk-btn-secondary" style={{ padding: '20px', borderRadius: '20px', fontSize: '1.1rem', justifyContent: 'center', color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)' }} onMouseOver={(e)=>{e.currentTarget.style.background='#ff4757'; e.currentTarget.style.color='#FFF'}} onMouseOut={(e)=>{e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color='#ff4757'}}>
          <FaPlus /> INITIALISER UN CANAL
        </button>
        
        <div className="tk-scroll-zone-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTickets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.4)' }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem' }}>Aucun ticket trouvé.</p>
            </div>
          )}
          {filteredTickets.map(t => {
            const statusStyle = STATUS_STYLES[t.status] || STATUS_STYLES['Ouvert'];
            const catColor = CATEGORY_COLORS[t.category] || '#B0B5B9';
            const isSelected = selectedTicketUid === t.ticket_uid;
            
            return (
              <div key={t.ticket_uid} onClick={() => setSelectedTicketUid(t.ticket_uid)} style={{ 
                padding: '1.5rem', borderRadius: '20px', 
                background: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255,255,255,0.02)', 
                border: `1px solid ${isSelected ? '#00E5FF' : 'rgba(255,255,255,0.05)'}`, 
                cursor: 'pointer', transition: '0.3s',
                boxShadow: isSelected ? 'inset 1px 1px 2px rgba(255,255,255,0.1)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                  <span className="tk-tech-font" style={{ color: isSelected ? '#00E5FF' : '#B0B5B9', fontSize: '1rem', fontWeight: 'bold' }}>{t.ticket_uid}</span>
                  <span style={{ fontSize: '0.8rem', color: catColor, fontWeight: 700, background: `${catColor}15`, padding: '3px 8px', borderRadius: '6px', border: `1px solid ${catColor}40` }}>{t.category}</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '1rem', color: '#FFF', marginBottom: '12px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                    background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`
                  }}>
                    <FaCircle style={{ fontSize: '6px' }} /> {t.status}
                  </div>
                  <span className="tk-text-muted" style={{ fontSize: '0.75rem' }}>{formatDate(t.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tk-liquid-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px' }}>
        {selectedTicket ? (
          <>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="tk-text-metal" style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  LIAISON SÉCURISÉE <span style={{color: '#00E5FF'}}>{selectedTicket.ticket_uid}</span>
                </h3>
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                  background: (STATUS_STYLES[selectedTicket.status] || STATUS_STYLES['Ouvert']).bg, 
                  color: (STATUS_STYLES[selectedTicket.status] || STATUS_STYLES['Ouvert']).color, 
                  border: `1px solid ${(STATUS_STYLES[selectedTicket.status] || STATUS_STYLES['Ouvert']).border}`
                }}>
                  <FaCircle style={{ fontSize: '6px' }} /> {selectedTicket.status}
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                {selectedTicket.title} — {selectedTicket.category}
              </div>
            </div>
            
            <div className="tk-scroll-zone-main" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                  Aucun message. Envoyez le premier message pour démarrer la conversation.
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.author_id === user?.id;
                const isStaff = msg.author_role === 'Staff' || msg.author_role === 'Admin';
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <img src={msg.author_avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isStaff ? '#ff4757' : '#00E5FF' }}>
                        {msg.author_name}
                        {isStaff && <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: 'rgba(255,71,87,0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,71,87,0.3)' }}>{msg.author_role}</span>}
                      </span>
                      <span className="tk-text-muted" style={{ fontSize: '0.75rem' }}>{formatDate(msg.created_at)}</span>
                    </div>
                    <div className={`tk-chat-bubble ${isMe ? 'tk-chat-me' : 'tk-chat-other'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {selectedTicket.status !== 'Fermé' ? (
              <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '1rem', flexShrink: 0 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <FaTerminal style={{ position: 'absolute', top: '16px', left: '18px', color: '#00E5FF', fontSize: '1rem' }} />
                  <input 
                    type="text" 
                    placeholder="Répondre..." 
                    value={newMsg} 
                    onChange={(e) => setNewMsg(e.target.value)} 
                    maxLength={2000}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 14px 14px 45px', color: '#FFF', outline: 'none', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', transition: '0.3s', boxSizing: 'border-box' }} 
                    onFocus={(e)=>e.target.style.borderColor='#00E5FF'} 
                    onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} 
                  />
                </div>
                <button type="submit" disabled={sending} className="tk-btn-primary" style={{ padding: '0 30px', borderRadius: '14px', fontSize: '1.2rem' }}><FaPaperPlane /></button>
              </form>
            ) : (
              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                Ce ticket est fermé.
              </div>
            )}
          </>
        ) : (
          <div className="tk-tech-font" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0B5B9', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '2px' }}>SÉLECTIONNEZ UNE REQUÊTE</div>
        )}
      </div>
    </motion.div>
  );
}
