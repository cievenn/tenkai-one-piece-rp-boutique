import { useStore } from '../../../context/StoreContext';

export default function SidebarRight({ searchQuery }) {
  const { user } = useStore();

  return (
    <aside className="tk-sidebar-nav tk-premium-sidebar" style={{ height: '100%', padding: '1.5rem 0', width: '90px' }}>
      
      <div className="tk-premium-sidebar-inner">
        <div className="tk-sidebar-tech-grid" />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top, rgba(0,229,255,0.05), transparent 50%)' }} />
      </div>

      <div className="tk-scroll-zone" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'visible', zIndex: 2 }}>
        
        <div className="tk-tech-font" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '25px', letterSpacing: '2px', textAlign: 'center' }}>MOI</div>
        
        {user && (
          <div className="tk-player-avatar">
            <img src={user.avatarCustom || user.avatar} alt={user.username} style={{ borderRadius: '12px' }} />
            <div className="tk-status-dot online" />
            <div className="tk-player-tooltip">
              <div className="tk-tech-font" style={{ color: '#FFF', fontSize: '1.2rem' }}>{user.username}</div>
              <div className="tk-tech-font" style={{ color: '#00E5FF', fontSize: '0.9rem', marginTop: '5px' }}>{user.role}</div>
            </div>
          </div>
        )}

        <div style={{ width: '35px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', margin: '20px 0' }} />
        
        <div className="tk-tech-font" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '25px', letterSpacing: '2px', textAlign: 'center' }}>INFOS</div>
        
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', padding: '0 8px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
          v1.0
        </div>
      </div>
    </aside>
  );
}
