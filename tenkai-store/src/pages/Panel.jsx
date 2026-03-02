import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaServer, FaTicketAlt, FaBook, FaSearch, FaCog, 
  FaBell, FaCamera, FaPaperPlane, FaUserAlt, 
  FaCircle, FaShieldAlt, FaClock, FaCheckCircle, 
  FaExclamationCircle, FaLock, FaGamepad, FaCommentDots,
  FaTimes, FaPlus, FaCoins, FaSkull, FaTerminal
} from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

export default function Panel() {
  // ==================== ÉTATS GLOBAUX ====================
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // ==================== DONNÉES UTILISATEUR (API STEAM) ====================
  const { user } = useStore(); 

  const [currentUser, setCurrentUser] = useState({
    pseudo: user?.name || "Pirate_Inconnu",
    role: "Capitaine",
    faction: "Équipage Indépendant",
    playtime: "342h",
    joinDate: "Système Actif",
    avatar: user?.avatar || "https://i.pravatar.cc/150?img=11",
    banner: "/bg_op.webp"
  });

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Vrai explorateur de fichiers (Aperçu local)
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCurrentUser(prev => ({ ...prev, [type]: imageUrl }));
    }
  };

  // ==================== SYSTÈMES ACTIFS ====================
  
  // 1. Amis (Vide, prêt à recevoir les données Steam)
  const [friends, setFriends] = useState([]); 
  
  // 2. Joueurs Serveur
  const [serverPlayers, setServerPlayers] = useState([
    { id: 1, name: "Zoro_77", status: "online", role: "Chasseur de Primes" },
    { id: 2, name: "Sanji_Kick", status: "online", role: "Cuisinier" },
    { id: 3, name: "UsoppGod", status: "afk", role: "Sniper" },
    { id: 4, name: "Robin_Chwan", status: "dnd", role: "Archéologue" },
    { id: 5, name: "Franky_Cyborg", status: "online", role: "Charpentier" }
  ]);
  const filteredPlayers = serverPlayers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // 3. Vraies Notifications
  const notifications = [
    { id: 1, type: 'alert', title: 'CANDIDATURES RP DISPONIBLES', text: 'Ouverture des slots : Homme-Poisson, Skypien et Mink. Ouvrez un ticket.', time: 'Il y a 1h' },
    { id: 2, type: 'staff', title: 'RECRUTEMENT STAFF', text: 'Nous recherchons 3 Animateurs RP. Déposez votre dossier.', time: 'Hier' }
  ];

  // 4. Vrai système de Tickets (Messagerie scindée)
  const [tickets, setTickets] = useState([
    { 
      id: "TK-1042", title: "Candidature Homme-Poisson", status: "ouvert", date: "14:00",
      messages: [
        { sender: currentUser.pseudo, text: "Requête d'authentification pour intégration RP : Race Homme-Poisson. Ci-joint mon background.", time: "14:30", isMe: true },
        { sender: "SYS_ADMIN", text: "Données reçues. Analyse du background en cours par l'équipe de validation.", time: "15:05", isMe: false }
      ]
    }
  ]);
  const filteredTickets = tickets.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery));
  
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [newMsg, setNewMsg] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedTicket) return;
    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedTicket = { ...t, messages: [...t.messages, { sender: currentUser.pseudo, text: newMsg, time: "À l'instant", isMe: true }] };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return t;
    });
    setTickets(updatedTickets);
    setNewMsg('');
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;
    const ticket = { id: `TK-${Math.floor(1000 + Math.random() * 9000)}`, title: newTicketTitle, status: "ouvert", date: "À l'instant", messages: [] };
    setTickets([ticket, ...tickets]);
    setNewTicketTitle('');
    setIsTicketModalOpen(false);
    setSelectedTicket(ticket);
    setActiveView('tickets');
  };

  // 5. Mur de Commentaires
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([{ id: Date.now(), author: currentUser.pseudo, avatar: currentUser.avatar, time: "À l'instant", text: newCommentText }, ...comments]);
    setNewCommentText('');
  };

  // 6. Paramètres (Vrais Toggles)
  const [settings, setSettings] = useState({ notifs: true, streamerMode: false, darkTheme: true });

  // ==================== ANIMATIONS ====================
  // Animation en fondu pour un changement de vue fluide
  const fadeVariants = {
    hidden: { opacity: 0, filter: 'blur(5px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } },
    exit: { opacity: 0, filter: 'blur(5px)', transition: { duration: 0.2 } }
  };

  return (
    <section style={{ padding: '2rem 0', minHeight: '80vh' }}>
      
      {/* --- CSS ISOLÉ (N'impacte plus la Navbar ni le Body) --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;800&display=swap');

        /* LE CONTENEUR PRINCIPAL : 75% de l'écran, centré, avec le vide sur les côtés */
        .tenkai-os-container {
          position: relative;
          width: 75%; /* Prend 3/4 de l'écran */
          min-width: 1100px;
          max-width: 1600px;
          height: calc(100vh - 140px); /* Reste fixe en hauteur, sous la navbar */
          margin: 0 auto; /* Centre le conteneur */
          display: flex;
          gap: 1.5rem;
          font-family: 'Inter', sans-serif;
          color: #e2e8f0;
          z-index: 10;
        }

        .tech-font { font-family: 'Rajdhani', sans-serif; text-transform: uppercase; }
        
        .clip-panel { clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px); }
        .clip-button { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }

        /* Colonnes Strictes */
        .col-left { 
          width: 90px; flex-shrink: 0; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; 
          background: rgba(5,8,12,0.8); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 20px;
          backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0,0,0,0.6); z-index: 50;
        }
        .col-center { 
          flex: 1; min-width: 0; display: flex; flex-direction: column; position: relative; 
          background: rgba(5,8,12,0.8); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 20px;
          backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden;
        }
        .col-right { 
          width: 350px; flex-shrink: 0; padding: 1.5rem 0; display: flex; flex-direction: column;
          background: rgba(5,8,12,0.8); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 20px;
          backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden; z-index: 40;
        }

        /* Scrollbars Internes Cyberpunk */
        .scroll-area { overflow-y: auto; height: 100%; width: 100%; }
        .scroll-area::-webkit-scrollbar { width: 4px; }
        .scroll-area::-webkit-scrollbar-track { background: transparent; }
        .scroll-area::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 4px; }
        .scroll-area::-webkit-scrollbar-thumb:hover { background: #00E5FF; }

        /* Sidebar Navigation */
        .nav-item {
          position: relative; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;
          margin-bottom: 1rem; cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: rgba(255,255,255,0.3); font-size: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 12px;
        }
        .nav-item:hover { color: #00E5FF; background: rgba(0, 229, 255, 0.05); }
        .nav-item.active { color: #00E5FF; background: rgba(0, 229, 255, 0.1); box-shadow: inset 0 0 20px rgba(0,229,255,0.2); border-left: 3px solid #00E5FF; border-radius: 4px 12px 12px 4px; }
        
        .nav-tooltip {
          position: absolute; left: 80px; background: rgba(2, 4, 8, 0.98); border: 1px solid #00E5FF; color: #00E5FF;
          padding: 8px 16px; font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; white-space: nowrap; pointer-events: none;
          opacity: 0; transform: translateX(-15px); transition: 0.3s; box-shadow: 0 0 20px rgba(0,229,255,0.4); z-index: 100;
        }
        .nav-item:hover .nav-tooltip { opacity: 1; transform: translateX(0); }

        /* Top Bar */
        .top-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; border-bottom: 1px solid rgba(0,229,255,0.1); background: rgba(2,4,8,0.5); z-index: 20; flex-shrink: 0; }
        .search-hud { display: flex; align-items: center; gap: 15px; background: rgba(0,0,0,0.6); padding: 12px 25px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); width: 400px; transition: 0.3s; }
        .search-hud:focus-within { border-color: #00E5FF; box-shadow: 0 0 20px rgba(0,229,255,0.15); background: rgba(0,229,255,0.05); }
        .search-hud input { background: transparent; border: none; color: #FFF; outline: none; width: 100%; font-size: 1rem; letter-spacing: 1px; }

        /* Notification Dropdown */
        .notif-dropdown { position: absolute; top: 60px; right: 0; width: 400px; background: rgba(5, 8, 12, 0.98); backdrop-filter: blur(30px); border: 1px solid #00E5FF; box-shadow: 0 20px 50px rgba(0,0,0,0.9); z-index: 100; border-radius: 16px; overflow: hidden;}

        /* Cartes d'Information */
        .data-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 2rem; transition: 0.3s; position: relative; overflow: hidden; }
        .data-card:hover { background: rgba(0,229,255,0.02); border-color: rgba(0,229,255,0.2); }
        
        .cyber-btn { background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 12px 25px; font-weight: 800; font-size: 1rem; letter-spacing: 2px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 10px; justify-content: center; }
        .cyber-btn:hover { background: #00E5FF; color: #000; box-shadow: 0 0 25px rgba(0,229,255,0.6); }

        /* Chat System */
        .term-chat { padding: 14px 20px; font-size: 1rem; line-height: 1.5; font-family: 'Inter'; max-width: 85%; }
        .term-me { background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.3); color: #00E5FF; align-self: flex-end; border-left: 3px solid #00E5FF; }
        .term-admin { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #FFF; align-self: flex-start; border-right: 3px solid #ffcc00; }

        /* Fichiers & Édition */
        .hover-edit { cursor: pointer; position: relative; overflow: hidden; }
        .edit-layer { position: absolute; inset: 0; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0; transition: 0.3s; color: #00E5FF; font-weight: 800; font-size: 1.2rem; letter-spacing: 2px; z-index: 20; backdrop-filter: blur(4px); }
        .hover-edit:hover .edit-layer { opacity: 1; }

        /* Toggles Settings */
        .toggle-switch { width: 50px; height: 26px; background: rgba(255,255,255,0.1); border-radius: 20px; position: relative; cursor: pointer; transition: 0.3s; border: 1px solid rgba(255,255,255,0.2); }
        .toggle-switch.active { background: rgba(0,229,255,0.2); border-color: #00E5FF; box-shadow: inset 0 0 10px rgba(0,229,255,0.5); }
        .toggle-dot { width: 18px; height: 18px; background: #FFF; border-radius: 50%; position: absolute; top: 3px; left: 4px; transition: 0.3s; }
        .toggle-switch.active .toggle-dot { left: 26px; background: #00E5FF; box-shadow: 0 0 10px #00E5FF; }

        /* VUES ABSOLUES : LA CLÉ POUR NE PAS AVOIR DE LAYOUT SHIFT */
        .view-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow-y: auto; padding: 2rem 3rem; }
        .view-container::-webkit-scrollbar { width: 4px; }
        .view-container::-webkit-scrollbar-track { background: transparent; }
        .view-container::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.3); border-radius: 4px; }

        /* Modal Overlay isolée */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 9999; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1200px) {
          .tenkai-os-container { width: 95%; min-width: auto; }
        }
        @media (max-width: 900px) {
          .tenkai-os-container { flex-direction: column; height: auto; }
          .col-left { width: 100%; flex-direction: row; padding: 1rem; justify-content: space-around; }
          .col-right { width: 100%; height: 500px; }
          .view-container { position: relative; overflow-y: visible; }
        }
      `}} />

      {/* =========================================================
          INPUTS CACHÉS (EXPLORATEUR FICHIERS RÉEL)
      ========================================================= */}
      <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'avatar')} />
      <input type="file" accept="image/*" ref={bannerInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'banner')} />

      {/* CONTENEUR FIXE À 75% DE L'ÉCRAN */}
      <div className="tenkai-os-container">
        
        {/* =========================================================
            COLONNE 1 : SIDEBAR GAUCHE (ICONES)
        ========================================================= */}
        <div className="col-left">
          <div style={{ width: '50px', height: '50px', background: '#00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', boxShadow: '0 0 20px rgba(0,229,255,0.4)' }} className="clip-hexagon">
            <img src="/tenkailogo.png" alt="T" style={{ width: '60%', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="scroll-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'visible' }}>
            {[
              { id: 'home', icon: <FaServer />, label: 'Nexus Central' },
              { id: 'profile', icon: <FaUserAlt />, label: 'Dossier Personnel' },
              { id: 'tickets', icon: <FaTicketAlt />, label: 'Liaison Support' },
              { id: 'lore', icon: <FaBook />, label: 'Archives & Règles' }
            ].map(item => (
              <div key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => { setActiveView(item.id); setSearchQuery(''); }}>
                {item.icon}
                <div className="nav-tooltip tech-font clip-button">{item.label}</div>
              </div>
            ))}
          </div>

          <div className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>
            <FaCog />
            <div className="nav-tooltip tech-font clip-button">Configuration</div>
          </div>
        </div>

        {/* =========================================================
            COLONNE 2 : LE CENTRE DU HUD (ZÉRO LAYOUT SHIFT)
        ========================================================= */}
        <div className="col-center">
          
          {/* TOP BAR FIXE */}
          <div className="top-nav">
            <div className="search-hud tech-font">
              <FaSearch color="#00E5FF" />
              <input type="text" placeholder="INTERCEPTER DES DONNÉES..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div style={{ position: 'relative', display: 'flex', gap: '20px' }}>
              <div style={{ padding: '12px', background: isNotifOpen ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)', color: isNotifOpen ? '#00E5FF' : '#FFF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <FaBell fontSize="1.3rem" />
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '10px', height: '10px', background: '#ff4757', borderRadius: '50%', boxShadow: '0 0 15px #ff4757' }} />
              </div>

              {/* NOTIFICATIONS (Vraies annonces) */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="notif-dropdown">
                    <div className="tech-font" style={{ padding: '1.2rem 1.5rem', background: 'rgba(0, 229, 255, 0.1)', borderBottom: '1px solid rgba(0,229,255,0.3)', fontSize: '1.2rem', color: '#00E5FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>// ALERTES SYSTÈME</span>
                      <FaTimes style={{ cursor: 'pointer', color: '#FFF' }} onClick={() => setIsNotifOpen(false)} />
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '10px' }}>
                      {notifications.map(notif => (
                        <div key={notif.id} style={{ padding: '1.2rem', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                          <div className="tech-font" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '1.1rem', color: notif.type === 'alert' ? '#ff4757' : '#00e676', letterSpacing: '1px' }}>[{notif.title}]</span>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>{notif.time}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>{notif.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CONTENEUR DE VUE ABSOLU (LA MAGIE DU STATIQUE EST ICI) */}
          <div style={{ flex: 1, position: 'relative' }}>
            <AnimatePresence mode="wait">
              
              {/* ------------ VUE : DASHBOARD ------------ */}
              {activeView === 'home' && (
                <motion.div key="home" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="view-container">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Hero Card */}
                    <div className="clip-panel" style={{ position: 'relative', width: '100%', height: '350px', background: '#000', border: '1px solid rgba(0,229,255,0.2)', overflow: 'hidden' }}>
                      <img src="/bg_op.webp" alt="Feed" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} onError={(e) => e.target.src='https://via.placeholder.com/1500x400/05080f/00E5FF?text=FLUX+SATELLITE'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(2,4,8,1) 0%, rgba(2,4,8,0.2) 60%, transparent 100%)' }} />
                      
                      <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                        <div className="tech-font clip-button" style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid #00e676', color: '#00e676', padding: '8px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(0,230,118,0.2)' }}>
                          <FaCircle style={{ animation: 'pulse 2s infinite', fontSize: '0.7rem' }} /> SYSTÈME STABLE
                        </div>
                      </div>

                      <div style={{ position: 'absolute', bottom: '3rem', left: '3rem' }}>
                        <div className="tech-font" style={{ color: '#00E5FF', fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '5px' }}>// GRAND LINE INITIATIVE</div>
                        <h1 className="tech-font" style={{ fontSize: '5rem', margin: 0, color: '#FFF', textShadow: '0 0 40px rgba(0,229,255,0.5)', lineHeight: 0.9 }}>TENKAI RP</h1>
                        <div style={{ display: 'flex', gap: '25px', marginTop: '20px' }}>
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 25px', borderLeft: '3px solid #00E5FF', backdropFilter: 'blur(5px)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Entités Connectées</div>
                            <div className="tech-font" style={{ fontSize: '2rem', color: '#FFF' }}>{serverPlayers.length} <span style={{fontSize:'1rem', color:'rgba(255,255,255,0.4)'}}>/ 128</span></div>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 25px', borderLeft: '3px solid #ffcc00', backdropFilter: 'blur(5px)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Temps de Cycle</div>
                            <div className="tech-font" style={{ fontSize: '2rem', color: '#ffcc00' }}>04:00:00</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Serveur Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                      <div className="data-card clip-button" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem' }}>
                        <FaCoins style={{ position: 'absolute', right: '-20px', fontSize: '10rem', color: '#ffcc00', opacity: 0.05, transform: 'rotate(15deg)' }} />
                        <div style={{ width: '70px', height: '70px', background: 'rgba(255,204,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffcc00', fontSize: '2.5rem' }} className="clip-hexagon"><FaCoins /></div>
                        <div>
                          <div className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>CIBLE LA PLUS RICHE</div>
                          <div className="tech-font" style={{ fontSize: '1.8rem', color: '#FFF', fontWeight: 'bold' }}>Gol D. Roger</div>
                          <div className="tech-font" style={{ color: '#ffcc00', fontSize: '1.4rem' }}>15,000,000 ฿</div>
                        </div>
                      </div>
                      <div className="data-card clip-button" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem' }}>
                        <FaSkull style={{ position: 'absolute', right: '-20px', fontSize: '10rem', color: '#ff4757', opacity: 0.05, transform: 'rotate(-15deg)' }} />
                        <div style={{ width: '70px', height: '70px', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757', fontSize: '2.5rem' }} className="clip-hexagon"><FaSkull /></div>
                        <div>
                          <div className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px' }}>MENACE MAXIMALE</div>
                          <div className="tech-font" style={{ fontSize: '1.8rem', color: '#FFF', fontWeight: 'bold' }}>Monkey D. Luffy</div>
                          <div className="tech-font" style={{ color: '#ff4757', fontSize: '1.4rem' }}>1,500,000,000 ฿</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ------------ VUE : PROFIL (EXPLORATEUR FICHIER RÉEL) ------------ */}
              {activeView === 'profile' && (
                <motion.div key="profile" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="view-container">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Bannière et Avatar modifiables */}
                    <div className="hover-edit clip-panel" style={{ position: 'relative', width: '100%', height: '300px', border: '1px solid rgba(0,229,255,0.2)' }} onClick={() => bannerInputRef.current.click()}>
                      <img src={currentUser.banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src='https://via.placeholder.com/1500x400/1b2838/FFF?text=RE-CALIBRER+BANNIÈRE'} />
                      <div className="edit-layer tech-font"><FaCamera size="2.5rem" /> RE-CALIBRER LA BANNIÈRE</div>
                      
                      <div className="hover-edit clip-hexagon" style={{ position: 'absolute', bottom: '-40px', left: '4rem', width: '160px', height: '160px', background: '#02040a', padding: '6px', zIndex: 10, boxShadow: '0 15px 30px rgba(0,0,0,0.8)' }} onClick={(e) => { e.stopPropagation(); avatarInputRef.current.click(); }}>
                        <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                        <div className="edit-layer clip-hexagon"><FaCamera size="2rem" /></div>
                      </div>
                    </div>

                    <div style={{ padding: '0 4rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h2 className="tech-font" style={{ fontSize: '4rem', margin: '0 0 10px 0', color: '#FFF', textShadow: '0 0 20px rgba(255,255,255,0.2)', lineHeight: 0.9 }}>{currentUser.pseudo}</h2>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <span className="tech-font" style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '8px 20px', border: '1px solid rgba(0, 229, 255, 0.3)', fontSize: '1.1rem', letterSpacing: '2px' }}>[{currentUser.role}]</span>
                          <span className="tech-font" style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', padding: '8px 20px', border: '1px solid rgba(255, 71, 87, 0.3)', fontSize: '1.1rem', letterSpacing: '2px' }}>FACTION : {currentUser.faction}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
                      <div className="data-card clip-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                        <FaClock style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)', marginBottom: '10px' }}/>
                        <div className="tech-font" style={{ fontSize: '2.5rem', color: '#FFF' }}>{currentUser.playtime}</div>
                        <div className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>TEMPS DE JEU</div>
                      </div>
                      <div className="data-card clip-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                        <FaShieldAlt style={{ fontSize: '2.5rem', color: '#00E5FF', marginBottom: '10px' }}/>
                        <div className="tech-font" style={{ fontSize: '2.5rem', color: '#FFF' }}>{currentUser.joinDate}</div>
                        <div className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>IDENTIFICATION</div>
                      </div>
                      <div className="data-card clip-button" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                        <FaGamepad style={{ fontSize: '2.5rem', color: '#00e676', marginBottom: '10px' }}/>
                        <div className="tech-font" style={{ fontSize: '2.5rem', color: '#00e676' }}>100%</div>
                        <div className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>FIABILITÉ RP</div>
                      </div>
                    </div>

                    {/* Vrai Mur Interactif */}
                    <div style={{ marginTop: '1.5rem' }}>
                      <h3 className="tech-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#00E5FF', display: 'flex', alignItems: 'center', gap: '10px' }}><FaCommentDots /> LOGS DE TRANSMISSION</h3>
                      <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="search-hud clip-button" style={{ flex: 1, padding: '16px 25px', width: 'auto' }}>
                          <input type="text" placeholder="Entrez vos données publiques ici..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} style={{ fontSize: '1.1rem' }} />
                        </div>
                        <button type="submit" className="cyber-btn clip-button" style={{ padding: '0 40px', fontSize: '1.2rem' }}><FaPaperPlane /> ÉMETTRE</button>
                      </form>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.length === 0 ? <div className="tech-font" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', textAlign: 'center', padding: '2rem' }}>// AUCUNE DONNÉE TROUVÉE DANS LES LOGS</div> : null}
                        <AnimatePresence>
                          {comments.map((comment) => (
                            <motion.div key={comment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="data-card clip-button" style={{ padding: '1.5rem 2rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <img src={comment.avatar} style={{ width: '40px', height: '40px', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} alt="A" />
                                  <strong className="tech-font" style={{ color: '#00E5FF', fontSize: '1.4rem', letterSpacing: '1px' }}>{comment.author}</strong>
                                </div>
                                <span className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }}>[{comment.time}]</span>
                              </div>
                              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontSize: '1.05rem' }}>{comment.text}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ------------ VUE : TICKETS (VRAI CHAT) ------------ */}
              {activeView === 'tickets' && (
                <motion.div key="tickets" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="view-container" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
                  
                  {/* Liste des Tickets */}
                  <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                    <button onClick={() => setIsTicketModalOpen(true)} className="btn-danger clip-button tech-font" style={{ padding: '20px', fontSize: '1.2rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <FaPlus /> INITIALISER UN CANAL
                    </button>
                    
                    <div className="scroll-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {filteredTickets.map(ticket => (
                        <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className={`data-card clip-button`} style={{ cursor: 'pointer', background: selectedTicket?.id === ticket.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.02)', borderColor: selectedTicket?.id === ticket.id ? '#00E5FF' : 'rgba(255,255,255,0.05)', padding: '1.2rem' }}>
                          <div className="tech-font" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem' }}>
                            <span style={{ color: selectedTicket?.id === ticket.id ? '#00E5FF' : 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>{ticket.id}</span>
                            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{ticket.date}</span>
                          </div>
                          <div style={{ fontWeight: '600', fontSize: '1rem', color: '#FFF', marginBottom: '10px', lineHeight: '1.4' }}>{ticket.title}</div>
                          <div className="tech-font" style={{ fontSize: '1rem', color: ticket.status === 'ouvert' ? '#ffcc00' : '#00e676', letterSpacing: '1px' }}>
                            [{ticket.status === 'ouvert' ? 'ATTENTE OPÉRATEUR' : 'RÉSOLU'}]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interface Chat du Ticket */}
                  <div className="clip-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,229,255,0.2)', height: '100%' }}>
                    {selectedTicket ? (
                      <>
                        <div className="tech-font" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.05)', fontSize: '1.4rem', color: '#00E5FF', letterSpacing: '2px' }}>
                          <FaTerminal style={{ display: 'inline', marginRight: '10px' }} /> LIAISON SÉCURISÉE : {selectedTicket.id}
                        </div>
                        
                        <div className="scroll-area" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {selectedTicket.messages?.map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                              <span className="tech-font" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px', letterSpacing: '1px' }}>{msg.sender} // {msg.time}</span>
                              <div className={`term-chat ${msg.isMe ? 'term-me clip-button' : 'term-admin clip-panel'}`}>{msg.text}</div>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>
                          <div className="search-hud clip-button" style={{ flex: 1, width: 'auto', padding: '14px 20px' }}>
                            <input type="text" placeholder="Saisir la transmission..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
                          </div>
                          <button type="submit" className="cyber-btn clip-button" style={{ padding: '0 30px', fontSize: '1.2rem' }}><FaPaperPlane /></button>
                        </form>
                      </>
                    ) : (
                      <div className="tech-font" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '2rem', letterSpacing: '3px' }}>
                        // SÉLECTIONNER UN CANAL //
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ------------ VUE : LORE & RÈGLES ------------ */}
              {(activeView === 'lore' || activeView === 'rules') && (
                <motion.div key="docs" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="view-container">
                  <h2 className="tech-font" style={{ fontSize: '4rem', marginBottom: '2rem', color: activeView==='lore' ? '#00E5FF' : '#ffcc00', textShadow: `0 0 30px ${activeView==='lore' ? 'rgba(0,229,255,0.3)' : 'rgba(255,204,0,0.3)'}` }}>
                    {activeView === 'lore' ? 'ARCHIVES DE GRAND LINE' : 'DIRECTIVES SYSTÈME'}
                  </h2>
                  
                  <div style={{ display: 'flex', gap: '2rem', height: 'calc(100% - 100px)' }}>
                    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {['Introduction', 'Les Factions', 'Les Races', 'Le Haki'].map((item, i) => (
                        <div key={i} className="data-card clip-button tech-font" style={{ fontSize: '1.2rem', cursor: 'pointer', color: i===0 ? '#00E5FF' : 'inherit', borderColor: i===0 ? '#00E5FF' : 'rgba(255,255,255,0.05)', padding: '1.2rem' }}>
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="data-card clip-panel scroll-area" style={{ flex: 1, padding: '3rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>[Données en attente de synchronisation via l'API distante...]</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ------------ VUE : PARAMÈTRES (VRAIS TOGGLES) ------------ */}
              {activeView === 'settings' && (
                <motion.div key="settings" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="view-container">
                  <h2 className="tech-font" style={{ fontSize: '4rem', marginBottom: '3rem', color: '#FFF' }}>CONFIGURATION SYSTÈME</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    
                    <div className="data-card clip-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem' }}>
                      <div>
                        <h4 className="tech-font" style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: '#00E5FF' }}>NOTIFICATIONS</h4>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>Activer les alertes sonores et visuelles.</p>
                      </div>
                      <div className={`toggle-switch ${settings.notifs ? 'active' : ''}`} onClick={() => setSettings({...settings, notifs: !settings.notifs})}>
                        <div className="toggle-dot"></div>
                      </div>
                    </div>

                    <div className="data-card clip-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem' }}>
                      <div>
                        <h4 className="tech-font" style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: '#00e676' }}>MODE STREAMER</h4>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>Masquer les informations sensibles.</p>
                      </div>
                      <div className={`toggle-switch ${settings.streamerMode ? 'active' : ''}`} onClick={() => setSettings({...settings, streamerMode: !settings.streamerMode})}>
                        <div className="toggle-dot"></div>
                      </div>
                    </div>

                    <div className="data-card clip-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem', gridColumn: '1 / -1' }}>
                      <div>
                        <h4 className="tech-font" style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: '#ff4757' }}>LIAISON API STEAM</h4>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>Synchronisation des données de jeu.</p>
                      </div>
                      <div className="tech-font" style={{ color: '#00e676', border: '1px solid #00e676', padding: '10px 20px', borderRadius: '8px' }}>CONNECTÉ</div>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* =========================================================
            COLONNE 3 : PANNEAU SOCIAL (AMIS & SERVEUR)
        ========================================================= */}
        <div className="col-right">
          <div style={{ padding: '0 1.5rem' }}>
            <h3 className="tech-font" style={{ color: '#00E5FF', fontSize: '1.4rem', borderBottom: '1px solid rgba(0,229,255,0.2)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              RADAR RÉSEAU <span style={{ color: '#FFF', background: 'rgba(0,229,255,0.1)', padding: '5px 15px', border: '1px solid rgba(0,229,255,0.3)', clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>[{filteredPlayers.length}]</span>
            </h3>
          </div>
          
          <div className="scroll-area" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* SECTION AMIS */}
            <div>
              <div className="tech-font" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', letterSpacing: '2px' }}>CONTACTS ALLIÉS</div>
              {friends.length === 0 ? (
                <div className="tech-font clip-button" style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem' }}>
                  AUCUN SIGNAL DÉTECTÉ.<br/><span style={{fontSize:'0.9rem', color: 'rgba(255,255,255,0.2)'}}>(En attente de l'API Steam)</span>
                </div>
              ) : (
                friends.map((player) => (
                  <div key={`friend-${player.id}`} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)', cursor: 'pointer', marginBottom: '10px' }} className="clip-button">
                    <img src={`https://i.pravatar.cc/150?u=${player.name}`} style={{ width: '45px', height: '45px' }} className="clip-hexagon" alt="A" />
                    <div>
                      <div className="tech-font" style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 'bold' }}>{player.name}</div>
                      <div className="tech-font" style={{ fontSize: '0.9rem', color: '#00E5FF' }}>[{player.role}]</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SECTION SERVEUR GLOBALE */}
            <div>
              <div className="tech-font" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', letterSpacing: '2px', marginTop: '1rem' }}>SIGNAUX LOCAUX</div>
              {filteredPlayers.map((player) => (
                <div key={`online-${player.id}`} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid transparent', cursor: 'pointer', transition: '0.3s', marginBottom: '5px' }} className="clip-button" onMouseOver={(e)=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'} onMouseOut={(e)=>e.currentTarget.style.borderColor='transparent'}>
                  <div style={{ position: 'relative' }}>
                    <img src={`https://i.pravatar.cc/150?u=${player.name}`} style={{ width: '40px', height: '40px', filter: player.status !== 'online' ? 'grayscale(100%) opacity(40%)' : 'none' }} className="clip-hexagon" alt="P" />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', border: '2px solid #080c14', borderRadius: '50%', background: player.status === 'online' ? '#00e676' : player.status === 'afk' ? '#ffcc00' : '#ff4757' }} />
                  </div>
                  <div className="tech-font" style={{ fontSize: '1.2rem', color: player.status === 'online' ? '#FFF' : 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{player.name}</div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>

      {/* =========================================================
          MODALE : CRÉER UN TICKET (ISOLÉE)
      ========================================================= */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="modal-overlay" onClick={() => setIsTicketModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="hud-glass clip-panel"
              style={{ width: '600px', padding: '3rem', borderTop: '4px solid #ff4757' }}
            >
              <h2 className="tech-font" style={{ color: '#ff4757', fontSize: '2.5rem', margin: '0 0 2rem 0', textShadow: '0 0 20px rgba(255,71,87,0.4)' }}>// INITIALISER REQUÊTE</h2>
              <form onSubmit={handleCreateTicket}>
                <label className="tech-font" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontSize: '1.2rem' }}>OBJET DE LA TRANSMISSION</label>
                <div className="search-hud clip-button" style={{ width: '100%', marginBottom: '2.5rem', padding: '15px 20px' }}>
                  <input type="text" required value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{fontSize:'1.1rem'}} />
                </div>
                <button type="submit" className="btn-danger clip-button tech-font" style={{ width: '100%', padding: '15px', fontSize: '1.4rem', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                  <FaPaperPlane /> ÉMETTRE LE SIGNAL
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}