import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBell, FaTimes } from 'react-icons/fa';

export default function TopBar({ activeView, searchQuery, setSearchQuery, announcements }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const viewNames = {
    'home': 'Dashboard Central',
    'profile': 'Dossier Personnel',
    'tickets': 'Liaison Support',
    'rules': 'Directives Systèmes',
    'lore': 'Archives Lore',
    'settings': 'Configuration'
  };

  return (
    <div className="tk-top-bar">
      <div className="tk-breadcrumb tk-tech-font">
        <span className="tk-text-cyan" style={{ marginRight: '15px' }}>{'//'}</span> 
        <span className="tk-text-muted" style={{ marginRight: '15px' }}>TENKAI_OS</span> 
        <span style={{ opacity: 0.3, marginRight: '15px' }}>{'>'}</span> 
        <span className="tk-text-metal" style={{ fontSize: '1.2rem' }}>{viewNames[activeView]}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="tk-search-wrapper">
          <FaSearch className="tk-search-icon" />
          <input type="text" placeholder="Intercepter des données..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className="tk-shortcut">CTRL K</div>
        </div>

        <div style={{ position: 'relative' }}>
          <div className={`tk-notif-btn ${isNotifOpen ? 'active' : ''}`} onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <FaBell className="tk-bell-icon" fontSize="1.3rem" />
            <div className="tk-nav-badge" style={{ top: '-4px', right: '-4px', width: '12px', height: '12px' }} />
          </div>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'absolute', top: '80px', right: 0, width: '450px', background: 'rgba(5, 8, 12, 0.98)', backdropFilter: 'blur(30px)', border: '1px solid #00E5FF', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.9)', zIndex: 100, overflow: 'hidden', borderTop: '1px solid rgba(0,229,255,0.5)' }}>
                <div className="tk-tech-font" style={{ padding: '1.5rem 2rem', background: 'rgba(0, 229, 255, 0.1)', borderBottom: '1px solid rgba(0,229,255,0.2)', fontSize: '1.4rem', color: '#00E5FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>// ALERTES SYSTÈME</span><FaTimes style={{ cursor: 'pointer', color: '#FFF' }} onClick={() => setIsNotifOpen(false)} />
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '15px' }}>
                  {announcements.map(notif => (
                    <div key={notif.id} style={{ padding: '1.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                      <div className="tk-tech-font" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.2rem', color: notif.type === 'RP' ? '#c471ed' : '#ff4757', letterSpacing: '1px' }}>[{notif.title}]</span>
                      </div>
                      <p className="tk-text-muted" style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>{notif.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}