import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaBell, FaHome, 
  FaUserCircle, FaSignOutAlt, FaChevronDown,
  FaTerminal
} from 'react-icons/fa';

export default function TopBar({ activeView, setActiveView, searchQuery, setSearchQuery, announcements = [] }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Simulation des données utilisateur
  const user = {
    pseudo: "Pirate_99",
    avatar: "https://i.pravatar.cc/150?img=11",
    balance: "1,500",
    role: "Capitaine",
    level: 42,
    xp: 75 
  };

  const unreadNotifs = announcements.length;

  return (
    <div className="tk-topbar-master" style={{ position: 'relative', zIndex: 50, flexShrink: 0 }}>
      
      {/* --- CSS CRÈME DE LA CRÈME V5 (Tooltips) --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .tk-topbar-master {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 2.5rem; 
          background: linear-gradient(180deg, rgba(2, 4, 10, 0.7) 0%, rgba(2, 4, 10, 0.1) 100%);
          backdrop-filter: blur(25px) saturate(120%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .tk-topbar-master::after {
          content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6) 50%, transparent);
          box-shadow: 0 1px 15px rgba(0, 229, 255, 0.5);
        }

        /* 1. BARRE DE RECHERCHE (Terminal HUD Cybernétique - GAUCHE) */
        .tk-search-hud {
          display: flex; align-items: center; gap: 12px; position: relative;
          background: rgba(0, 0, 0, 0.6); padding: 12px 20px 12px 24px; border-radius: 12px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          border-left: 3px solid rgba(255, 255, 255, 0.2);
          width: 380px; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          box-shadow: inset 0 3px 10px rgba(0,0,0,0.8);
          overflow: hidden; margin-right: auto;
        }

        .tk-search-cursor {
          position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
          width: 4px; height: 16px; background: rgba(255,255,255,0.3);
          animation: blink 1s infinite; transition: 0.3s;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .tk-search-hud:focus-within {
          width: 500px; border-color: rgba(0, 229, 255, 0.3); 
          border-left: 3px solid #00E5FF; background: rgba(0, 229, 255, 0.03);
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.15), inset 0 2px 10px rgba(0,0,0,0.5);
        }
        .tk-search-hud:focus-within .tk-search-cursor { background: #00E5FF; box-shadow: 0 0 8px #00E5FF; }

        .tk-search-hud input {
          background: transparent; border: none; color: #FFF; outline: none; width: 100%; 
          font-size: 0.95rem; font-family: 'Inter'; font-weight: 500;
        }
        .tk-search-hud input::placeholder { color: rgba(255,255,255,0.25); font-style: italic; letter-spacing: 0.5px;}
        
        .tk-search-icon { color: rgba(255,255,255,0.3); font-size: 1rem; transition: 0.3s; }
        .tk-search-hud:focus-within .tk-search-icon { color: #00E5FF; filter: drop-shadow(0 0 8px #00E5FF); }
        
        .tk-search-shortcut { 
          background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; 
          font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.6); letter-spacing: 1px; flex-shrink: 0; 
          font-family: 'Rajdhani', sans-serif; box-shadow: 0 3px 0 rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2);
          transform: translateY(-2px); transition: 0.2s;
        }
        .tk-search-hud:focus-within .tk-search-shortcut {
          transform: translateY(1px); box-shadow: 0 0 0 rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1);
          color: #00E5FF; border-color: rgba(0,229,255,0.3);
        }

        /* 2. ACTIONS & PROFIL (Droite) */
        .tk-topbar-actions { display: flex; align-items: center; gap: 1.2rem; }

        /* BOUTONS CARRÉS (Accueil & Notif) */
        .tk-topbar-btn {
          position: relative; width: 48px; height: 48px; border-radius: 14px; 
          display: flex; justify-content: center; align-items: center;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); 
          border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); 
          cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: inset 1px 1px 1px rgba(255,255,255,0.05), 0 5px 15px rgba(0,0,0,0.3);
        }
        .tk-topbar-btn:hover, .tk-topbar-btn.active { 
          color: #00E5FF; border-color: rgba(0,229,255,0.4); background: rgba(0,229,255,0.05); 
          box-shadow: inset 1px 1px 5px rgba(0,229,255,0.2), 0 5px 20px rgba(0,229,255,0.15); 
          transform: translateY(-2px);
        }
        
        .tk-topbar-btn:hover svg, .tk-topbar-btn.active svg { filter: drop-shadow(0 0 8px #00E5FF); }

        /* TOOLTIP HOLOGRAPHIQUE (Style Sidebar) */
        .tk-topbar-tooltip {
          position: absolute; top: calc(100% + 12px); left: 50%; transform: translateX(-50%) translateY(10px);
          background: rgba(2, 4, 8, 0.98); border: 1px solid #00E5FF; color: #00E5FF;
          padding: 6px 14px; font-size: 0.8rem; font-weight: 800; letter-spacing: 1.5px; 
          white-space: nowrap; pointer-events: none; opacity: 0; z-index: 100;
          transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 0 20px rgba(0,229,255,0.3);
          border-radius: 8px; font-family: 'Rajdhani', sans-serif; text-transform: uppercase;
        }
        /* La petite flèche du tooltip */
        .tk-topbar-tooltip::before {
          content: ''; position: absolute; top: -5px; left: 50%; transform: translateX(-50%) rotate(45deg);
          width: 8px; height: 8px; background: rgba(2, 4, 8, 0.98); border-top: 1px solid #00E5FF; border-left: 1px solid #00E5FF;
        }
        
        .tk-topbar-btn:hover .tk-topbar-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* Badge Notification */
        .tk-topbar-notif-badge {
          position: absolute; top: -5px; right: -5px; background: linear-gradient(135deg, #ff4757, #ff6b81);
          color: #fff; font-size: 0.65rem; font-weight: 900; width: 22px; height: 22px; border-radius: 50%; 
          display: flex; justify-content: center; align-items: center;
          box-shadow: 0 0 15px rgba(255,71,87,0.6); border: 2px solid #04080E;
        }

        /* BOUTON PROFIL (Capsule) */
        .tk-topbar-profile-btn {
          display: flex; align-items: center; gap: 12px; padding: 6px 16px 6px 6px; 
          border-radius: 100px; 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); 
          cursor: pointer; transition: 0.3s; box-shadow: inset 1px 1px 2px rgba(255,255,255,0.05);
        }
        .tk-topbar-profile-btn:hover, .tk-topbar-profile-btn.open {
          background: rgba(0,229,255,0.05); border-color: rgba(0,229,255,0.4); 
          box-shadow: 0 8px 25px rgba(0,229,255,0.15), inset 1px 1px 3px rgba(0,229,255,0.2);
        }
        
        .tk-topbar-avatar-wrap { position: relative; width: 44px; height: 44px; }
        .tk-topbar-avatar { width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(0,229,255,0.5); object-fit: cover; box-shadow: 0 0 10px rgba(0,229,255,0.2); }
        .tk-topbar-level {
          position: absolute; bottom: -2px; right: -4px; background: #02040A; border: 1px solid #00E5FF;
          color: #00E5FF; font-size: 0.55rem; font-weight: 900; padding: 2px 5px; border-radius: 6px;
          box-shadow: 0 0 8px rgba(0,229,255,0.4);
        }
        
        .tk-topbar-user-info { display: flex; flex-direction: column; justify-content: center; }
        
        /* DROPDOWN BENTO PREMIUM */
        .tk-profile-dropdown {
          position: absolute; top: calc(100% + 20px); right: 0; width: 340px;
          background: linear-gradient(145deg, rgba(12, 18, 30, 0.85) 0%, rgba(4, 8, 14, 0.98) 100%);
          backdrop-filter: blur(40px) saturate(150%); border-radius: 20px; 
          border: 1px solid rgba(0,229,255,0.2); border-top: 1px solid rgba(0,229,255,0.5);
          box-shadow: 0 25px 50px rgba(0,0,0,0.9), 0 0 30px rgba(0,229,255,0.1), inset 1px 1px 1px rgba(255,255,255,0.05);
          overflow: hidden; z-index: 1000; display: flex; flex-direction: column;
        }
        
        .tk-dropdown-tech-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; 
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); 
          background-size: 12px 12px;
        }

        .tk-dropdown-content { position: relative; z-index: 10; }

        .tk-dropdown-header { 
          padding: 1.5rem; background: radial-gradient(circle at top right, rgba(0,229,255,0.1), transparent 70%); 
          border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 15px;
        }
        .tk-dropdown-user-row { display: flex; align-items: center; gap: 15px; }
        .tk-dropdown-avatar { width: 60px; height: 60px; border-radius: 16px; border: 2px solid #00E5FF; box-shadow: 0 0 20px rgba(0,229,255,0.3); }
        
        .tk-xp-bar-container { width: 100%; height: 6px; background: rgba(0,0,0,0.5); border-radius: 10px; overflow: hidden; margin-top: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.8); }
        .tk-xp-bar-fill { height: 100%; background: linear-gradient(90deg, #0055ff, #00E5FF); box-shadow: 0 0 10px #00E5FF; }

        .tk-dropdown-wallet {
          display: flex; justify-content: space-between; align-items: center;
          background: linear-gradient(90deg, rgba(255,215,0,0.05), rgba(255,215,0,0.02)); 
          border: 1px solid rgba(255,215,0,0.2); border-left: 3px solid #FFD700;
          padding: 12px 18px; border-radius: 12px; margin-bottom: 0.5rem; backdrop-filter: blur(5px);
        }

        .tk-dropdown-item {
          display: flex; align-items: center; gap: 12px; padding: 1.2rem 1.5rem; cursor: pointer;
          color: rgba(255,255,255,0.6); font-weight: 600; font-size: 0.95rem; transition: 0.2s;
        }
        .tk-dropdown-item:hover { background: rgba(255,255,255,0.04); color: #FFF; padding-left: 2rem; border-left: 3px solid #00E5FF; }
        .tk-dropdown-item.danger:hover { background: rgba(255, 71, 87, 0.05); color: #ff4757; border-left: 3px solid #ff4757; }
      `}} />

      {/* ==========================================
          1. RECHERCHE CENTRE (TERMINAL HUD GAUCHE)
      ========================================== */}
      <div className="tk-search-hud">
        <div className="tk-search-cursor" />
        <FaTerminal className="tk-search-icon" />
        <input 
          type="text" 
          placeholder="DATABANK_SEARCH..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <span className="tk-search-shortcut">CTRL+K</span>
      </div>

      {/* ==========================================
          2. ACTIONS & PROFIL DROITE (Accueil + Notifs + Profil)
      ========================================== */}
      <div className="tk-topbar-actions" style={{ position: 'relative' }}>
        
        {/* Bouton Accueil (Icône + Tooltip au survol) */}
        <button 
          className={`tk-topbar-btn ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => setActiveView && setActiveView('home')}
        >
          <FaHome size="1.2rem" style={{ transition: '0.3s' }} />
          <div className="tk-topbar-tooltip">Accueil</div>
        </button>

        {/* Bouton Notification (Icône + Tooltip au survol) */}
        <div className="tk-topbar-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
          <FaBell size="1.2rem" style={{ animation: unreadNotifs > 0 ? 'pulse 2s infinite' : 'none', transition: '0.3s' }} />
          {unreadNotifs > 0 && <div className="tk-topbar-notif-badge">{unreadNotifs}</div>}
          <div className="tk-topbar-tooltip">Notifications</div>
        </div>

        {/* Séparateur léger entre les icônes et le profil */}
        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)', margin: '0 5px' }} />

        {/* Bouton Profil */}
        <div className={`tk-topbar-profile-btn ${isProfileOpen ? 'open' : ''}`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <div className="tk-topbar-avatar-wrap">
            <img src={user.avatar} alt="Avatar" className="tk-topbar-avatar" />
            <div className="tk-topbar-level">{user.level}</div>
          </div>
          <div className="tk-topbar-user-info">
            <span className="tk-tech-font" style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FFF', letterSpacing: '1px', lineHeight: 1 }}>{user.pseudo}</span>
            <span className="tk-tech-font" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginTop: '2px' }}>{user.role}</span>
          </div>
          <FaChevronDown size="0.7rem" color="rgba(255,255,255,0.4)" style={{ marginLeft: '6px', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
        </div>

        {/* Dropdown Bento Premium */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(15px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="tk-profile-dropdown"
            >
              <div className="tk-dropdown-tech-grid" />
              
              <div className="tk-dropdown-content">
                <div className="tk-dropdown-header">
                  <div className="tk-dropdown-user-row">
                    <img src={user.avatar} alt="Avatar" className="tk-dropdown-avatar" />
                    <div style={{ flex: 1 }}>
                      <div className="tk-text-metal" style={{ fontSize: '1.3rem', lineHeight: 1, marginBottom: '6px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>{user.pseudo}</div>
                      <div className="tk-tech-font" style={{ fontSize: '0.85rem', color: '#00E5FF', letterSpacing: '1px', textShadow: '0 0 8px rgba(0,229,255,0.4)' }}>
                        NIVEAU {user.level} // {user.role}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontWeight: 900, letterSpacing: '1px' }}>
                      <span>SYNCHRONISATION HAKI</span>
                      <span style={{ color: '#00E5FF' }}>{user.xp}%</span>
                    </div>
                    <div className="tk-xp-bar-container">
                      <motion.div 
                        className="tk-xp-bar-fill" 
                        initial={{ width: 0 }} 
                        animate={{ width: `${user.xp}%` }} 
                        transition={{ duration: 1.2, delay: 0.1, ease: "circOut" }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <div className="tk-dropdown-wallet">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="tk-tech-font" style={{ fontSize: '0.7rem', color: 'rgba(255,215,0,0.6)', letterSpacing: '1px' }}>SOLDE COMPTE</span>
                      <span className="tk-tech-font" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFD700', textShadow: '0 0 15px rgba(255,215,0,0.4)' }}>{user.balance} ฿</span>
                    </div>
                    <button 
                      onClick={() => { window.location.href = '/boutique'; setIsProfileOpen(false); }}
                      style={{ background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)', border: 'none', color: '#000', padding: '8px 14px', borderRadius: '8px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255,215,0,0.3)', transition: '0.2s', letterSpacing: '1px' }}
                      onMouseOver={(e)=> { e.currentTarget.style.transform='scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 20px rgba(255,215,0,0.5)' }}
                      onMouseOut={(e)=> { e.currentTarget.style.transform='scale(1) translateY(0)'; e.currentTarget.style.boxShadow='0 5px 15px rgba(255,215,0,0.3)' }}
                    >
                      DÉPÔT
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="tk-dropdown-item" onClick={() => { setActiveView && setActiveView('profile'); setIsProfileOpen(false); }}>
                    <FaUserCircle size="1.2rem" color="#00E5FF" style={{ filter: 'drop-shadow(0 0 5px #00E5FF)' }} /> 
                    <span className="tk-tech-font" style={{ letterSpacing: '1px' }}>Dossier Personnel</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                  <div className="tk-dropdown-item danger" onClick={() => { window.location.href = '/'; }}>
                    <FaSignOutAlt size="1.2rem" /> 
                    <span className="tk-tech-font" style={{ letterSpacing: '1px' }}>Déconnexion Sécurisée</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}