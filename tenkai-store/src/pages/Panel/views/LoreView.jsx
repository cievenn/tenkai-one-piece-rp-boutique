import { motion } from 'framer-motion';

export default function LoreView({ variants, activeView }) {
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="view-container">
      <h1 className="tk-text-metal" style={{ fontSize: '4.5rem', marginBottom: '3rem' }}>{activeView === 'rules' ? 'RÈGLEMENT OFFICIEL' : 'ARCHIVES DE GRAND LINE'}</h1>
      <div className="tk-bento-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <div className="tk-bento-card">
          <div className="tk-bento-inner"></div>
          <div style={{ padding: '4rem', position: 'relative', zIndex: 10 }}>
            <div className="tk-badge tk-badge-rp" style={{ marginBottom: '25px', fontSize: '0.9rem', padding: '10px 20px' }}>CHAPITRE 1</div>
            <h3 className="tk-text-metal" style={{ fontSize: '2.2rem', color: '#FFF', marginBottom: '2rem' }}>Comportement (HRP)</h3>
            <p className="tk-text-muted" style={{ lineHeight: 1.8, fontSize: '1.2rem' }}>Le respect est absolu. Toute forme de toxicité HRP entraînera un bannissement permanent de l'écosystème Tenkai.</p>
          </div>
        </div>
        <div className="tk-bento-card">
          <div className="tk-bento-inner"></div>
          <div style={{ padding: '4rem', position: 'relative', zIndex: 10 }}>
            <div className="tk-badge tk-badge-staff" style={{ marginBottom: '25px', fontSize: '0.9rem', padding: '10px 20px' }}>CHAPITRE 2</div>
            <h3 className="tk-text-metal" style={{ fontSize: '2.2rem', color: '#FFF', marginBottom: '2rem' }}>Règles d'Engagement</h3>
            <p className="tk-text-muted" style={{ lineHeight: 1.8, fontSize: '1.2rem' }}>Des sommations claires et une ligne de dialogue doivent précéder tout affrontement armé (Anti-RDM).</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}