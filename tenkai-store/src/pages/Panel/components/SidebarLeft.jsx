import { FaServer, FaTicketAlt, FaBook, FaCog, FaPlus, FaGavel, FaUserAlt } from 'react-icons/fa';

export default function SidebarLeft({ activeView, setActiveView, setIsTicketModalOpen }) {
  return (
    <nav 
      className="tk-sidebar-nav tk-premium-sidebar" 
      /* Ajout de boxSizing: 'border-box' et width: '90px' pour l'alignement parfait */
      style={{ height: '100%', padding: '1.5rem 0', width: '90px', boxSizing: 'border-box', margin: '0'}}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .tk-premium-sidebar {
          background: linear-gradient(145deg, rgba(12, 18, 30, 0.7) 0%, rgba(4, 8, 14, 0.95) 100%);
          backdrop-filter: blur(30px) saturate(150%);
          border-radius: 16px;
          border: 1px solid rgba(0, 229, 255, 0.1);
          box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.05), inset -1px -1px 2px rgba(0, 0, 0, 0.6), 0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(0, 229, 255, 0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: visible;
        }
        
        .tk-premium-sidebar-inner {
          position: absolute; inset: 0; border-radius: 16px; overflow: hidden; z-index: -1;
        }
        
        .tk-premium-sidebar-inner::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: rgba(0, 229, 255, 0.4);
        }

        .tk-sidebar-tech-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; 
          background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px); 
          background-size: 12px 12px;
        }

        .tk-nav-logo-box-premium {
          width: 50px; height: 50px; display: flex; justify-content: center; align-items: center;
          background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(0, 229, 255, 0.2);
          border-radius: 12px; box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.1); margin-bottom: 2.5rem;
          position: relative; z-index: 2; flex-shrink: 0;
        }
      `}} />

      <div className="tk-premium-sidebar-inner">
        <div className="tk-sidebar-tech-grid" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top, rgba(0,229,255,0.05), transparent 50%)' }} />
      </div>

      <div className="tk-nav-logo-box-premium">
        <img src="/tenkailogo.webp" alt="T" style={{ width: '65%', filter: 'drop-shadow(0 0 5px #00E5FF)' }} onError={(e)=>e.target.style.display='none'} />
      </div>

      <div className="tk-scroll-zone" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'visible', zIndex: 2 }}>
        
        <div className={`tk-nav-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => setActiveView('home')}>
          <FaServer /><div className="tk-nav-tooltip tk-tech-font">Dashboard</div>
        </div>
        
        <div style={{ width: '35px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', margin: '15px 0', flexShrink: 0 }} />
        
        <div className="tk-nav-item" style={{ color: '#00E5FF', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '12px' }} onClick={() => setIsTicketModalOpen(true)}>
          <FaPlus /><div className="tk-nav-tooltip tk-tech-font">Créer un Ticket</div>
        </div>
        
        <div className={`tk-nav-item ${activeView === 'tickets' ? 'active' : ''}`} onClick={() => setActiveView('tickets')}>
          <FaTicketAlt /><div className="tk-nav-badge">1</div><div className="tk-nav-tooltip tk-tech-font">Mes Tickets</div>
        </div>

        <div style={{ width: '35px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', margin: '15px 0', flexShrink: 0 }} />

        <div className={`tk-nav-item ${activeView === 'rules' ? 'active' : ''}`} onClick={() => setActiveView('rules')}>
          <FaGavel /><div className="tk-nav-tooltip tk-tech-font">Règlement</div>
        </div>
        
        <div className={`tk-nav-item ${activeView === 'lore' ? 'active' : ''}`} onClick={() => setActiveView('lore')}>
          <FaBook /><div className="tk-nav-tooltip tk-tech-font">Archives Lore</div>
        </div>
      </div>
        <div style={{ width: '35px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', margin: '15px 0', flexShrink: 0 }} />

      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto', zIndex: 2 }}>
        <div className={`tk-nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>
          <FaCog /><div className="tk-nav-tooltip tk-tech-font">Paramètres</div>
        </div>
      </div>
    </nav>
  );
}