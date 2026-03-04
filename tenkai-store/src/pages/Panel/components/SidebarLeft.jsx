import { FaServer, FaTicketAlt, FaBook, FaCog, FaPlus, FaDiscord, FaGavel, FaUserAlt } from 'react-icons/fa';

export default function SidebarLeft({ activeView, setActiveView, setIsTicketModalOpen, setIsDiscordModalOpen }) {
  return (
    <nav className="tk-liquid-glass tk-sidebar-nav">
      <div className="tk-nav-logo-box">
        <img src="/tenkailogo.png" alt="T" style={{ width: '65%', filter: 'drop-shadow(0 0 5px #00E5FF)' }} onError={(e)=>e.target.style.display='none'} />
      </div>

      <div className="tk-scroll-zone" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'visible' }}>
        <div className={`tk-nav-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => setActiveView('home')}>
          <FaServer /><div className="tk-nav-tooltip tk-tech-font">Dashboard</div>
        </div>
        <div className={`tk-nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>
          <FaUserAlt /><div className="tk-nav-tooltip tk-tech-font">Dossier Personnel</div>
        </div>
        
        <div style={{ width: '35px', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '15px 0' }} />
        
        <div className="tk-nav-item" style={{ color: '#00E5FF', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0,229,255,0.2)' }} onClick={() => setIsTicketModalOpen(true)}>
          <FaPlus /><div className="tk-nav-tooltip tk-tech-font">Créer un Ticket</div>
        </div>
        <div className={`tk-nav-item ${activeView === 'tickets' ? 'active' : ''}`} onClick={() => setActiveView('tickets')}>
          <FaTicketAlt /><div className="tk-nav-badge">1</div><div className="tk-nav-tooltip tk-tech-font">Mes Tickets</div>
        </div>

        <div style={{ width: '35px', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '15px 0' }} />

        <div className={`tk-nav-item ${activeView === 'rules' ? 'active' : ''}`} onClick={() => setActiveView('rules')}>
          <FaGavel /><div className="tk-nav-tooltip tk-tech-font">Règlement</div>
        </div>
        <div className={`tk-nav-item ${activeView === 'lore' ? 'active' : ''}`} onClick={() => setActiveView('lore')}>
          <FaBook /><div className="tk-nav-tooltip tk-tech-font">Archives Lore</div>
        </div>
      </div>

      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}>
        <div className="tk-nav-item" onClick={() => setIsDiscordModalOpen(true)}>
          <FaDiscord color="#5865F2" /><div className="tk-nav-tooltip tk-tech-font" style={{ borderColor: '#5865F2', color: '#5865F2' }}>Discord</div>
        </div>
        <div className={`tk-nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>
          <FaCog /><div className="tk-nav-tooltip tk-tech-font">Paramètres</div>
        </div>
      </div>
    </nav>
  );
}