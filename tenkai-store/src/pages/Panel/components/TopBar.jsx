import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaBell, FaHome, 
  FaUserCircle, FaSignOutAlt, FaChevronDown,
  FaDiscord, FaTiktok, FaInstagram, FaYoutube, FaTwitter
} from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

export default function TopBar({ activeView, setActiveView, searchQuery, setSearchQuery, announcements = [], user, navigateToProfile }) {
  const { logout } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayAvatar = user?.avatarCustom || user?.avatar || '';
  const displayName = user?.username || 'Inconnu';
  const displayRole = user?.role || 'Citoyen';
  const unreadNotifs = announcements.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="tk-topbar-master" style={{ position: 'relative', zIndex: 50, flexShrink: 0 }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Orbitron:wght@400;600;800;900&display=swap');

        .tk-topbar-master {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem 2.5rem; 
          background: linear-gradient(180deg, rgba(2, 6, 14, 0.8) 0%, rgba(2, 6, 14, 0.2) 100%);
          backdrop-filter: blur(25px) saturate(120%);
          border-bottom: 1px solid rgba(0, 229, 255, 0.1);
          font-family: 'Outfit', sans-serif;
        }
        
        .tk-topbar-master::after {
          content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6) 50%, transparent);
          box-shadow: 0 1px 15px rgba(0, 229, 255, 0.5);
        }

        .tk-tech-font { font-family: 'Orbitron', sans-serif !important; letter-spacing: 1px; }

        .tk-topbar-left { flex: 1; display: flex; align-items: center; justify-content: flex-start; }
        
        .tk-search-hud {
          display: flex; align-items: center; gap: 12px; position: relative;
          background: linear-gradient(90deg, rgba(4, 10, 22, 0.9), rgba(2, 6, 14, 0.8));
          padding: 10px 18px 10px 20px; border-radius: 100px; 
          border: 1px solid rgba(0, 229, 255, 0.15); 
          width: 320px; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          box-shadow: inset 1px 1px 4px rgba(255,255,255,0.05), 0 5px 15px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .tk-search-hud::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
          background-size: 12px 12px; opacity: 0.8;
        }

        .tk-search-hud:focus-within {
          width: 420px; border-color: rgba(0, 229, 255, 0.5); 
          background: linear-gradient(90deg, rgba(0, 229, 255, 0.1), rgba(2, 6, 14, 0.9));
          box-shadow: 0 0 25px rgba(0, 229, 255, 0.2), inset 0 0 15px rgba(0,229,255,0.1);
        }

        .tk-search-hud input {
          background: transparent; border: none; color: #FFF; outline: none; width: 100%; 
          font-size: 0.9rem; font-family: 'Outfit', sans-serif; font-weight: 500;
          position: relative; z-index: 2; letter-spacing: 0.5px;
        }
        .tk-search-hud input::placeholder { 
          color: rgba(0, 229, 255, 0.4); font-family: 'Orbitron', sans-serif; 
          font-size: 0.75rem; letter-spacing: 1px; font-weight: 600;
        }
        
        .tk-search-icon { color: rgba(0, 229, 255, 0.4); font-size: 1rem; transition: 0.3s; position: relative; z-index: 2; }
        .tk-search-hud:focus-within .tk-search-icon { color: #00E5FF; filter: drop-shadow(0 0 8px #00E5FF); transform: scale(1.1); }
        
        .tk-search-shortcut { 
          background: rgba(0, 229, 255, 0.05);
          border: 1px solid rgba(0, 229, 255, 0.2); padding: 4px 10px; border-radius: 100px; 
          font-size: 0.65rem; font-weight: 900; color: rgba(0, 229, 255, 0.6); letter-spacing: 1px; flex-shrink: 0; 
          font-family: 'Orbitron', sans-serif; box-shadow: inset 0 0 5px rgba(0,229,255,0.1);
          transition: 0.3s; position: relative; z-index: 2;
        }
        .tk-search-hud:focus-within .tk-search-shortcut {
          background: #00E5FF; color: #000; box-shadow: 0 0 15px rgba(0,229,255,0.6); border-color: transparent;
        }

        .tk-topbar-center { flex: 1; display: flex; justify-content: center; align-items: center; }
        
        .tk-social-dock {
          display: flex; align-items: center; gap: 15px;
          background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 8px 20px; border-radius: 100px;
          box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .tk-social-icon {
          color: rgba(255, 255, 255, 0.4); font-size: 1.2rem; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative;
        }
        .tk-social-icon:hover {
          color: #00E5FF; transform: translateY(-3px) scale(1.1);
          filter: drop-shadow(0 5px 10px rgba(0, 229, 255, 0.6));
        }
        .tk-social-icon::after {
          content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #00E5FF; opacity: 0; transition: 0.3s;
          box-shadow: 0 0 8px #00E5FF;
        }
        .tk-social-icon:hover::after { opacity: 1; bottom: -5px; }

        .tk-topbar-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 1.2rem; }

        .tk-topbar-btn {
          position: relative; width: 44px; height: 44px; border-radius: 12px; 
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

        .tk-topbar-tooltip {
          position: absolute; top: calc(100% + 12px); left: 50%; transform: translateX(-50%) translateY(10px);
          background: rgba(2, 4, 8, 0.98); border: 1px solid #00E5FF; color: #00E5FF;
          padding: 6px 14px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1.5px; 
          white-space: nowrap; pointer-events: none; opacity: 0; z-index: 100;
          transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 0 20px rgba(0,229,255,0.3);
          border-radius: 8px; font-family: 'Orbitron', sans-serif; text-transform: uppercase;
        }
        .tk-topbar-tooltip::before {
          content: ''; position: absolute; top: -5px; left: 50%; transform: translateX(-50%) rotate(45deg);
          width: 8px; height: 8px; background: rgba(2, 4, 8, 0.98); border-top: 1px solid #00E5FF; border-left: 1px solid #00E5FF;
        }
        .tk-topbar-btn:hover .tk-topbar-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }

        .tk-topbar-notif-badge {
          position: absolute; top: -4px; right: -4px; background: #00E5FF;
          color: #000; font-family: 'Orbitron', sans-serif; font-size: 0.65rem; font-weight: 900; 
          width: 20px; height: 20px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.6); border: 2px solid #04080E;
        }

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
        
        .tk-topbar-avatar-wrap { position: relative; width: 40px; height: 40px; }
        .tk-topbar-avatar { width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(0,229,255,0.5); object-fit: cover; box-shadow: 0 0 10px rgba(0,229,255,0.2); }
        
        .tk-topbar-user-info { display: flex; flex-direction: column; justify-content: center; }

        .tk-profile-dropdown {
          position: absolute; top: calc(100% + 20px); right: 0; width: 340px;
          background: linear-gradient(145deg, rgba(8, 12, 22, 0.95) 0%, rgba(2, 4, 8, 0.98) 100%);
          backdrop-filter: blur(40px) saturate(150%); border-radius: 20px; 
          border: 1px solid rgba(0,229,255,0.2); border-top: 1px solid rgba(0,229,255,0.5);
          box-shadow: 0 25px 50px rgba(0,0,0,0.9), 0 0 30px rgba(0,229,255,0.15), inset 1px 1px 1px rgba(255,255,255,0.05);
          overflow: hidden; z-index: 1000; display: flex; flex-direction: column;
        }
        
        .tk-dropdown-nav-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; 
          background-image: linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px); 
          background-size: 20px 20px; opacity: 0.6;
        }

        .tk-dropdown-content { position: relative; z-index: 10; }

        .tk-dropdown-header { 
          padding: 1.5rem; background: radial-gradient(circle at top right, rgba(0,229,255,0.1), transparent 70%); 
          border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 15px;
        }
        .tk-dropdown-user-row { display: flex; align-items: center; gap: 15px; }
        .tk-dropdown-avatar { width: 55px; height: 55px; border-radius: 14px; border: 2px solid #00E5FF; box-shadow: 0 0 20px rgba(0,229,255,0.3); object-fit: cover; }

        .tk-dropdown-item {
          display: flex; align-items: center; gap: 12px; padding: 1.2rem 1.5rem; cursor: pointer;
          color: rgba(255,255,255,0.6); font-weight: 600; font-size: 0.95rem; transition: 0.2s;
        }
        .tk-dropdown-item:hover { background: rgba(255,255,255,0.04); color: #FFF; padding-left: 2rem; border-left: 3px solid #00E5FF; }
        .tk-dropdown-item.danger:hover { background: rgba(255, 71, 87, 0.05); color: #ff4757; border-left: 3px solid #ff4757; }

        @media (max-width: 1024px) {
          .tk-search-hud { width: 220px; }
          .tk-search-hud:focus-within { width: 280px; }
          .tk-social-dock { gap: 10px; padding: 8px 12px; }
        }

        @media (max-width: 768px) {
          .tk-topbar-master { padding: 1rem; flex-wrap: wrap; gap: 1rem; }
          .tk-topbar-left { order: 3; flex: 100%; }
          .tk-search-hud { width: 100% !important; border-radius: 8px; }
          .tk-topbar-center { order: 1; flex: 1; justify-content: flex-start; }
          .tk-topbar-right { order: 2; flex: 1; justify-content: flex-end; gap: 0.5rem; }
          .tk-topbar-user-info { display: none; }
          .tk-topbar-profile-btn { padding: 4px; border-radius: 50%; }
          .tk-topbar-profile-btn svg { display: none; }
          .tk-social-dock { padding: 6px 12px; gap: 12px; }
          .tk-social-icon { font-size: 1rem; }
          .tk-profile-dropdown { width: 300px; right: -10px; top: calc(100% + 15px); }
        }
      `}} />

      <div className="tk-topbar-left">
        <div className="tk-search-hud">
          <FaSearch className="tk-search-icon" />
          <input 
            type="text" 
            placeholder="SCAN LOG POSE..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <span className="tk-search-shortcut">EXPLORER</span>
        </div>
      </div>

      <div className="tk-topbar-center">
        <div className="tk-social-dock">
          <a href="#" className="tk-social-icon" title="Discord"><FaDiscord /></a>
          <a href="#" className="tk-social-icon" title="TikTok"><FaTiktok /></a>
          <a href="#" className="tk-social-icon" title="Instagram"><FaInstagram /></a>
          <a href="#" className="tk-social-icon" title="YouTube"><FaYoutube /></a>
          <a href="#" className="tk-social-icon" title="Twitter/X"><FaTwitter /></a>
        </div>
      </div>

      <div className="tk-topbar-right">
        
        <button 
          className={`tk-topbar-btn ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => setActiveView('home')}
        >
          <FaHome size="1.1rem" style={{ transition: '0.3s' }} />
          <div className="tk-topbar-tooltip">Accueil</div>
        </button>

        <div className="tk-topbar-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
          <FaBell size="1.1rem" style={{ animation: unreadNotifs > 0 ? 'pulse 2s infinite' : 'none', transition: '0.3s' }} />
          {unreadNotifs > 0 && <div className="tk-topbar-notif-badge">{unreadNotifs}</div>}
          <div className="tk-topbar-tooltip">Transmissions</div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 5px' }} />

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div className={`tk-topbar-profile-btn ${isProfileOpen ? 'open' : ''}`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="tk-topbar-avatar-wrap">
              <img src={displayAvatar} alt="Avatar" className="tk-topbar-avatar" />
            </div>
            <div className="tk-topbar-user-info">
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', letterSpacing: '0.5px', lineHeight: 1 }}>{displayName}</span>
              <span className="tk-tech-font" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{displayRole}</span>
            </div>
            <FaChevronDown size="0.7rem" color="rgba(255,255,255,0.4)" style={{ marginLeft: '4px', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(15px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="tk-profile-dropdown"
              >
                <div className="tk-dropdown-nav-grid" />
                
                <div className="tk-dropdown-content">
                  <div className="tk-dropdown-header">
                    <div className="tk-dropdown-user-row">
                      <img src={displayAvatar} alt="Avatar" className="tk-dropdown-avatar" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', lineHeight: 1, marginBottom: '6px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>{displayName}</div>
                        <div className="tk-tech-font" style={{ fontSize: '0.75rem', color: '#00E5FF', textShadow: '0 0 8px rgba(0,229,255,0.4)' }}>
                          {displayRole}
                          {user?.discordUsername && <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>// {user.discordUsername}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0.5rem 0' }}>
                    <div className="tk-dropdown-item" onClick={() => { navigateToProfile(user?.steamId); setIsProfileOpen(false); }}>
                      <FaUserCircle size="1.2rem" color="#00E5FF" style={{ filter: 'drop-shadow(0 0 5px #00E5FF)' }} /> 
                      <span style={{ letterSpacing: '1px', fontWeight: 500 }}>Mon Profil</span>
                    </div>
                    <div className="tk-dropdown-item" onClick={() => { setActiveView('settings'); setIsProfileOpen(false); }}>
                      <FaUserCircle size="1.2rem" color="rgba(255,255,255,0.4)" /> 
                      <span style={{ letterSpacing: '1px', fontWeight: 500 }}>Paramètres</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="tk-dropdown-item danger" onClick={logout}>
                      <FaSignOutAlt size="1.2rem" /> 
                      <span style={{ letterSpacing: '1px', fontWeight: 500 }}>Déconnexion Sécurisée</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
