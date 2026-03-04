import { useState } from 'react';

export default function SidebarRight({ searchQuery, serverPlayers }) {
  const [friends] = useState([
    { id: 1, name: "Zoro_77", status: "online", role: "Second" },
    { id: 2, name: "NamiSwann", status: "afk", role: "Navigatrice" }
  ]);

  const filteredFriends = friends.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPlayers = serverPlayers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <aside className="tk-liquid-glass tk-sidebar-nav" style={{ width: '100px' }}>
      <div className="tk-scroll-zone" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', overflow: 'visible' }}>
        
        <div className="tk-tech-font" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '25px', letterSpacing: '2px', textAlign: 'center' }}>ALLIÉS</div>
        
        {filteredFriends.map(f => (
          <div key={f.id} className="tk-player-avatar">
            <img src={`https://i.pravatar.cc/150?u=${f.name}`} alt={f.name} />
            <div className={`tk-status-dot ${f.status === 'online' ? 'online' : ''}`} style={{ background: f.status === 'online' ? '#00e676' : '#FFD700' }} />
            <div className="tk-player-tooltip">
              <div className="tk-tech-font" style={{ color: '#FFF', fontSize: '1.2rem' }}>{f.name}</div>
              <div className="tk-tech-font" style={{ color: '#00E5FF', fontSize: '0.9rem', marginTop: '5px' }}>{f.role}</div>
            </div>
          </div>
        ))}

        <div style={{ width: '35px', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
        
        <div className="tk-tech-font" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '25px', letterSpacing: '2px', textAlign: 'center' }}>GLOBAL</div>
        
        {filteredPlayers.map(p => (
          <div key={p.id} className="tk-player-avatar" style={{ filter: p.status !== 'online' ? 'grayscale(100%) opacity(50%)' : 'none' }}>
            <img src={`https://i.pravatar.cc/150?u=${p.name}`} alt={p.name} />
            <div className={`tk-status-dot ${p.status === 'online' ? 'online' : ''}`} style={{ background: p.status === 'online' ? '#00e676' : p.status === 'afk' ? '#FFD700' : '#DC143C' }} />
            <div className="tk-player-tooltip">
              <div className="tk-tech-font" style={{ color: '#FFF', fontSize: '1.2rem' }}>{p.name}</div>
              <div className="tk-tech-font" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>{p.status}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}