import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBell, FaHome, FaUserCircle, FaSignOutAlt, FaChevronDown, FaDiscord, FaTiktok, FaInstagram, FaYoutube, FaTwitter, FaCog, FaCircle } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

export default function TopBar({ activeView, setActiveView, searchQuery, setSearchQuery, user, navigateToProfile }) {
  const { logout, apiFetch } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const displayAvatar = user?.avatarCustom || user?.avatar || user?.discordAvatar || '';
  const displayName = user?.displayName || user?.discordUsername || 'Inconnu';
  const displayRole = user?.role || 'Citoyen';

  const loadNotifications = useCallback(async () => {
    try {
      const res = await apiFetch('/api/notifications');
      if (res.ok) { const d = await res.json(); setNotifications(d.notifications || []); }
    } catch {}
  }, [apiFetch]);

  useEffect(() => { loadNotifications(); const iv = setInterval(loadNotifications, 60000); return () => clearInterval(iv); }, [loadNotifications]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="tk-topbar-master" style={{ position: 'relative', zIndex: 50, flexShrink: 0 }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Orbitron:wght@400;600;800;900&display=swap');
        .tk-topbar-master { display:flex; justify-content:space-between; align-items:center; padding:1rem 2.5rem; background:linear-gradient(180deg,rgba(2,6,14,0.8),rgba(2,6,14,0.2)); backdrop-filter:blur(25px) saturate(120%); border-bottom:1px solid rgba(0,229,255,0.1); font-family:'Outfit',sans-serif; }
        .tk-topbar-master::after { content:''; position:absolute; bottom:-1px; left:0; width:100%; height:1px; background:linear-gradient(90deg,transparent,rgba(0,229,255,0.6) 50%,transparent); box-shadow:0 1px 15px rgba(0,229,255,0.5); }
        .tk-tech-font { font-family:'Orbitron',sans-serif !important; letter-spacing:1px; }
        .tk-topbar-left { flex:1; display:flex; align-items:center; }
        .tk-search-hud { display:flex; align-items:center; gap:12px; position:relative; background:linear-gradient(90deg,rgba(4,10,22,0.9),rgba(2,6,14,0.8)); padding:10px 18px 10px 20px; border-radius:100px; border:1px solid rgba(0,229,255,0.15); width:320px; transition:0.4s; box-shadow:inset 1px 1px 4px rgba(255,255,255,0.05),0 5px 15px rgba(0,0,0,0.5); overflow:hidden; }
        .tk-search-hud:focus-within { width:420px; border-color:rgba(0,229,255,0.5); background:linear-gradient(90deg,rgba(0,229,255,0.1),rgba(2,6,14,0.9)); box-shadow:0 0 25px rgba(0,229,255,0.2); }
        .tk-search-hud input { background:transparent; border:none; color:#FFF; outline:none; width:100%; font-size:0.9rem; font-family:'Outfit'; font-weight:500; position:relative; z-index:2; }
        .tk-search-hud input::placeholder { color:rgba(0,229,255,0.4); font-family:'Orbitron'; font-size:0.75rem; letter-spacing:1px; font-weight:600; }
        .tk-search-icon { color:rgba(0,229,255,0.4); font-size:1rem; transition:0.3s; position:relative; z-index:2; }
        .tk-search-hud:focus-within .tk-search-icon { color:#00E5FF; filter:drop-shadow(0 0 8px #00E5FF); }
        .tk-topbar-center { flex:1; display:flex; justify-content:center; }
        .tk-social-dock { display:flex; align-items:center; gap:15px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.05); padding:8px 20px; border-radius:100px; backdrop-filter:blur(10px); }
        .tk-social-icon { color:rgba(255,255,255,0.4); font-size:1.2rem; cursor:pointer; transition:0.3s; }
        .tk-social-icon:hover { color:#00E5FF; transform:translateY(-3px) scale(1.1); filter:drop-shadow(0 5px 10px rgba(0,229,255,0.6)); }
        .tk-topbar-right { flex:1; display:flex; justify-content:flex-end; align-items:center; gap:1.2rem; }
        .tk-topbar-btn { position:relative; width:44px; height:44px; border-radius:12px; display:flex; justify-content:center; align-items:center; background:linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.5); cursor:pointer; transition:0.3s; box-shadow:inset 1px 1px 1px rgba(255,255,255,0.05),0 5px 15px rgba(0,0,0,0.3); }
        .tk-topbar-btn:hover,.tk-topbar-btn.active { color:#00E5FF; border-color:rgba(0,229,255,0.4); background:rgba(0,229,255,0.05); transform:translateY(-2px); }
        .tk-topbar-notif-badge { position:absolute; top:-4px; right:-4px; background:#00E5FF; color:#000; font-family:'Orbitron'; font-size:0.65rem; font-weight:900; width:20px; height:20px; border-radius:50%; display:flex; justify-content:center; align-items:center; box-shadow:0 0 15px rgba(0,229,255,0.6); border:2px solid #04080E; }
        .tk-topbar-profile-btn { display:flex; align-items:center; gap:12px; padding:6px 16px 6px 6px; border-radius:100px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); cursor:pointer; transition:0.3s; }
        .tk-topbar-profile-btn:hover,.tk-topbar-profile-btn.open { background:rgba(0,229,255,0.05); border-color:rgba(0,229,255,0.4); }
        .tk-topbar-avatar { width:40px; height:40px; border-radius:50%; border:2px solid rgba(0,229,255,0.5); object-fit:cover; }
        .tk-profile-dropdown { position:absolute; top:calc(100% + 20px); right:0; width:340px; background:linear-gradient(145deg,rgba(8,12,22,0.95),rgba(2,4,8,0.98)); backdrop-filter:blur(40px); border-radius:20px; border:1px solid rgba(0,229,255,0.2); box-shadow:0 25px 50px rgba(0,0,0,0.9),0 0 30px rgba(0,229,255,0.15); overflow:hidden; z-index:1000; }
        .tk-dropdown-item { display:flex; align-items:center; gap:12px; padding:1.2rem 1.5rem; cursor:pointer; color:rgba(255,255,255,0.6); font-weight:600; font-size:0.95rem; transition:0.2s; }
        .tk-dropdown-item:hover { background:rgba(255,255,255,0.04); color:#FFF; padding-left:2rem; border-left:3px solid #00E5FF; }
        .tk-dropdown-item.danger:hover { background:rgba(255,71,87,0.05); color:#ff4757; border-left:3px solid #ff4757; }
        .tk-notif-dropdown { position:absolute; top:calc(100% + 15px); right:0; width:380px; max-height:400px; overflow-y:auto; background:linear-gradient(145deg,rgba(8,12,22,0.98),rgba(2,4,8,0.99)); backdrop-filter:blur(40px); border-radius:16px; border:1px solid rgba(0,229,255,0.2); box-shadow:0 20px 40px rgba(0,0,0,0.9); z-index:1000; }
        @media (max-width:768px) { .tk-topbar-master { padding:1rem; flex-wrap:wrap; gap:1rem; } .tk-topbar-left { order:3; flex:100%; } .tk-search-hud { width:100% !important; border-radius:8px; } .tk-topbar-center { order:1; } .tk-topbar-right { order:2; } }
      `}} />

      <div className="tk-topbar-left">
        <div className="tk-search-hud">
          <FaSearch className="tk-search-icon" />
          <input type="text" placeholder="SCAN LOG POSE..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="tk-topbar-center">
        <div className="tk-social-dock">
          <a href="#" className="tk-social-icon"><FaDiscord /></a>
          <a href="#" className="tk-social-icon"><FaTiktok /></a>
          <a href="#" className="tk-social-icon"><FaInstagram /></a>
          <a href="#" className="tk-social-icon"><FaYoutube /></a>
          <a href="#" className="tk-social-icon"><FaTwitter /></a>
        </div>
      </div>

      <div className="tk-topbar-right">
        <button className={`tk-topbar-btn ${activeView === 'home' ? 'active' : ''}`} onClick={() => setActiveView('home')}><FaHome size="1.1rem" /></button>

        <div ref={notifRef} style={{ position: 'relative' }}>
          <div className="tk-topbar-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <FaBell size="1.1rem" />
            {notifications.length > 0 && <div className="tk-topbar-notif-badge">{notifications.length}</div>}
          </div>
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="tk-notif-dropdown">
                <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="tk-tech-font" style={{ color: '#00E5FF', fontSize: '0.75rem', letterSpacing: '2px' }}>TRANSMISSIONS ({notifications.length})</span>
                </div>
                {notifications.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Aucune transmission récente.</div>}
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <FaCircle size={6} color={n.type === 'ticket' ? '#00E5FF' : n.type === 'announcement' ? '#FFD700' : '#00e676'} style={{ marginTop: '6px', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 600 }}>{n.title}</div>
                      {n.content && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '3px' }}>{n.content}</div>}
                      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '4px' }}>{new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 5px' }} />

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div className={`tk-topbar-profile-btn ${isProfileOpen ? 'open' : ''}`} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img src={displayAvatar} alt="Avatar" className="tk-topbar-avatar" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>{displayName}</span>
              <span className="tk-tech-font" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{displayRole}</span>
            </div>
            <FaChevronDown size="0.7rem" color="rgba(255,255,255,0.4)" style={{ marginLeft: '4px', transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.95 }} className="tk-profile-dropdown">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', background: 'radial-gradient(circle at top right, rgba(0,229,255,0.1), transparent 70%)' }}>
                  <img src={displayAvatar} alt="" style={{ width: '55px', height: '55px', borderRadius: '14px', border: '2px solid #00E5FF', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', lineHeight: 1, marginBottom: '6px' }}>{displayName}</div>
                    <div className="tk-tech-font" style={{ fontSize: '0.75rem', color: '#00E5FF' }}>{displayRole}</div>
                  </div>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  <div className="tk-dropdown-item" onClick={() => { navigateToProfile(user?.id); setIsProfileOpen(false); }}><FaUserCircle size="1.2rem" color="#00E5FF" /> Mon Profil</div>
                  <div className="tk-dropdown-item" onClick={() => { setActiveView('settings'); setIsProfileOpen(false); }}><FaCog size="1.2rem" color="rgba(255,255,255,0.4)" /> Paramètres</div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                  <div className="tk-dropdown-item danger" onClick={logout}><FaSignOutAlt size="1.2rem" /> Déconnexion</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
