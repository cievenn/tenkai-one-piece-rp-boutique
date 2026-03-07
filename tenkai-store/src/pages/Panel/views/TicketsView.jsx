import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTerminal, FaPaperPlane, FaCircle, FaUserShield, FaSkull, FaExclamationTriangle, FaGavel, FaBug, FaShoppingCart, FaBan, FaQuestionCircle, FaLightbulb, FaEllipsisH } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

const STATUS_STYLES = {
  'Ouvert': { bg: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', border: 'rgba(0, 229, 255, 0.3)' },
  'En attente': { bg: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', border: 'rgba(255, 215, 0, 0.3)' },
  'Fermé': { bg: 'rgba(0, 230, 118, 0.1)', color: '#00e676', border: 'rgba(0, 230, 118, 0.3)' }
};
const CATEGORY_COLORS = { 'Candidature RP': '#00E5FF', 'Demande RPK': '#ff4757', 'Plainte Joueur': '#FFD700', 'Plainte Staff': '#ff6b81', 'Bug Report': '#ff4757', 'Boutique': '#00E5FF', 'Unban': '#c471ed', 'Question': '#c471ed', 'Suggestion': '#00e676', 'Autre': '#B0B5B9' };
const CATEGORY_ICONS = { 'Candidature RP': FaUserShield, 'Demande RPK': FaSkull, 'Plainte Joueur': FaExclamationTriangle, 'Plainte Staff': FaGavel, 'Bug Report': FaBug, 'Boutique': FaShoppingCart, 'Unban': FaBan, 'Question': FaQuestionCircle, 'Suggestion': FaLightbulb, 'Autre': FaEllipsisH };

const QUICK_TYPES = [
  { category: 'Candidature RP', desc: 'Postulez pour un rôle RP' },
  { category: 'Demande RPK', desc: 'Validez un RPK' },
  { category: 'Plainte Joueur', desc: 'Signalez un joueur' },
  { category: 'Bug Report', desc: 'Signalez un bug' },
  { category: 'Suggestion', desc: 'Proposez une idée' }
];

export default function TicketsView({ variants, tickets, setTickets, searchQuery, setIsTicketModalOpen, openTicketWithCategory }) {
  const { apiFetch, user } = useStore();
  const filteredTickets = tickets.filter(t => (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.ticket_uid || '').includes(searchQuery));
  const [selectedTicketUid, setSelectedTicketUid] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(tickets.length === 0);
  const messagesEndRef = useRef(null);

  useEffect(() => { if (filteredTickets.length > 0 && !selectedTicketUid) setSelectedTicketUid(filteredTickets[0].ticket_uid); }, [filteredTickets, selectedTicketUid]);

  useEffect(() => {
    if (!selectedTicketUid) { setSelectedTicket(null); setMessages([]); return; }
    const load = async () => {
      try { const res = await apiFetch(`/api/tickets/${selectedTicketUid}`); if (res.ok) { const d = await res.json(); setSelectedTicket(d.ticket); setMessages(d.ticket.messages || []); } }
      catch (err) { console.error('Error loading ticket:', err); }
    };
    load();
  }, [selectedTicketUid, apiFetch]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedTicket || sending) return;
    setSending(true);
    try { const res = await apiFetch(`/api/tickets/${selectedTicketUid}/messages`, { method: 'POST', body: JSON.stringify({ content: newMsg }) }); if (res.ok) { const d = await res.json(); setMessages(prev => [...prev, d.message]); setNewMsg(''); } }
    catch (err) { console.error('Error sending message:', err); }
    finally { setSending(false); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  if (showTypeSelector && tickets.length === 0) {
    return (
      <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '2rem' }}>
        <h2 className="tk-text-metal" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>SYSTÈME DE TICKETS</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontFamily: 'Outfit, sans-serif' }}>Sélectionnez le type de requête pour créer un ticket pré-configuré, ou utilisez le bouton général.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {QUICK_TYPES.map(qt => {
            const Icon = CATEGORY_ICONS[qt.category] || FaEllipsisH;
            const color = CATEGORY_COLORS[qt.category] || '#B0B5B9';
            return (
              <div key={qt.category} onClick={() => openTicketWithCategory(qt.category)} style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}30`, cursor: 'pointer', transition: '0.3s', display: 'flex', flexDirection: 'column', gap: '8px' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Icon size={24} color={color} />
                <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem' }}>{qt.category}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{qt.desc}</div>
              </div>
            );
          })}
        </div>
        <button onClick={() => setIsTicketModalOpen(true)} className="tk-btn-secondary" style={{ padding: '16px 24px', borderRadius: '14px', fontSize: '1rem', justifyContent: 'center', color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)', width: '100%' }}>
          <FaPlus /> OUVRIR UN TICKET (TOUTES CATÉGORIES)
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="view-container" style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', flexShrink: 0 }}>
        <button onClick={() => setIsTicketModalOpen(true)} className="tk-btn-secondary" style={{ padding: '20px', borderRadius: '20px', fontSize: '1.1rem', justifyContent: 'center', color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)' }} onMouseOver={(e)=>{e.currentTarget.style.background='#ff4757'; e.currentTarget.style.color='#FFF'}} onMouseOut={(e)=>{e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color='#ff4757'}}><FaPlus /> INITIALISER UN CANAL</button>
        <div className="tk-scroll-zone-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTickets.length === 0 && <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.4)' }}><p style={{ fontFamily: 'Outfit, sans-serif' }}>Aucun ticket.</p></div>}
          {filteredTickets.map(t => {
            const sStyle = STATUS_STYLES[t.status] || STATUS_STYLES['Ouvert'];
            const catColor = CATEGORY_COLORS[t.category] || '#B0B5B9';
            const isSel = selectedTicketUid === t.ticket_uid;
            return (
              <div key={t.ticket_uid} onClick={() => { setSelectedTicketUid(t.ticket_uid); setShowTypeSelector(false); }} style={{ padding: '1.5rem', borderRadius: '20px', background: isSel ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isSel ? '#00E5FF' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: '0.3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                  <span className="tk-tech-font" style={{ color: isSel ? '#00E5FF' : '#B0B5B9', fontSize: '1rem', fontWeight: 'bold' }}>{t.ticket_uid}</span>
                  <span style={{ fontSize: '0.75rem', color: catColor, fontWeight: 700, background: `${catColor}15`, padding: '3px 8px', borderRadius: '6px', border: `1px solid ${catColor}40` }}>{t.category}</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '1rem', color: '#FFF', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, background: sStyle.bg, color: sStyle.color, border: `1px solid ${sStyle.border}` }}><FaCircle style={{ fontSize: '6px' }} /> {t.status}</div>
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
                <h3 className="tk-text-metal" style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>LIAISON <span style={{color: '#00E5FF'}}>{selectedTicket.ticket_uid}</span></h3>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, background: (STATUS_STYLES[selectedTicket.status] || STATUS_STYLES['Ouvert']).bg, color: (STATUS_STYLES[selectedTicket.status] || STATUS_STYLES['Ouvert']).color, border: `1px solid ${(STATUS_STYLES[selectedTicket.status] || STATUS_STYLES['Ouvert']).border}` }}><FaCircle style={{ fontSize: '6px' }} /> {selectedTicket.status}</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{selectedTicket.title} — {selectedTicket.category}</div>
            </div>
            <div className="tk-scroll-zone-main" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Envoyez le premier message.</div>}
              {messages.map((msg) => {
                const isMe = msg.author_id === user?.id;
                const isStaff = msg.author_role === 'Staff' || msg.author_role === 'Admin';
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <img src={msg.author_avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isStaff ? '#ff4757' : '#00E5FF' }}>{msg.author_name}{isStaff && <span style={{ marginLeft: '6px', fontSize: '0.7rem', background: 'rgba(255,71,87,0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,71,87,0.3)' }}>{msg.author_role}</span>}</span>
                      <span className="tk-text-muted" style={{ fontSize: '0.75rem' }}>{formatDate(msg.created_at)}</span>
                    </div>
                    <div className={`tk-chat-bubble ${isMe ? 'tk-chat-me' : 'tk-chat-other'}`}>{msg.content}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {selectedTicket.status !== 'Fermé' ? (
              <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', display: 'flex', gap: '1rem', flexShrink: 0 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <FaTerminal style={{ position: 'absolute', top: '16px', left: '18px', color: '#00E5FF', fontSize: '1rem' }} />
                  <input type="text" placeholder="Répondre..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} maxLength={2000} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 14px 14px 45px', color: '#FFF', outline: 'none', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', transition: '0.3s', boxSizing: 'border-box' }} onFocus={(e)=>e.target.style.borderColor='#00E5FF'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                </div>
                <button type="submit" disabled={sending} className="tk-btn-primary" style={{ padding: '0 30px', borderRadius: '14px', fontSize: '1.2rem' }}><FaPaperPlane /></button>
              </form>
            ) : <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Ce ticket est fermé.</div>}
          </>
        ) : <div className="tk-tech-font" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0B5B9', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '2px' }}>SÉLECTIONNEZ UNE REQUÊTE</div>}
      </div>
    </motion.div>
  );
}
