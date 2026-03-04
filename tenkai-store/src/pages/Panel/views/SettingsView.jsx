import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsView({ variants }) {
  const [settings, setSettings] = useState({ notifs: true, streamerMode: false });

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="view-container" style={{ position: 'absolute', inset: 0, padding: '3rem' }}>
      <h2 className="tk-text-metal" style={{ fontSize: '4rem', marginBottom: '4rem' }}>CONFIGURATION SYSTÈME</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '1400px' }}>
        
        <div className="tk-premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem' }}>
          <div className="tk-premium-inner"></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h4 className="tk-tech-font" style={{ margin: '0 0 10px 0', fontSize: '2rem', color: 'var(--cyan-neon)' }}>NOTIFICATIONS GLOBALES</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem' }}>Activer les alertes sonores et visuelles de l'OS.</p>
          </div>
          <div className={`tk-toggle-switch ${settings.notifs ? 'active' : ''}`} onClick={() => setSettings({...settings, notifs: !settings.notifs})} style={{ position: 'relative', zIndex: 10 }}>
            <div className="tk-toggle-dot"></div>
          </div>
        </div>

        <div className="tk-premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem' }}>
          <div className="tk-premium-inner" style={{ borderTopColor: '#00e676' }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h4 className="tk-tech-font" style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#00e676' }}>MODE STREAMER</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem' }}>Masquer les informations sensibles et les IP.</p>
          </div>
          <div className={`tk-toggle-switch ${settings.streamerMode ? 'active' : ''}`} onClick={() => setSettings({...settings, streamerMode: !settings.streamerMode})} style={{ position: 'relative', zIndex: 10 }}>
            <div className="tk-toggle-dot"></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}