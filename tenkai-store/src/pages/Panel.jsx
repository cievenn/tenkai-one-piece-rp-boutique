import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaServer, FaTicketAlt, FaBook, FaGavel, FaPlus } from 'react-icons/fa';

export default function Panel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <section className="page active" style={{ display: 'flex', gap: '2rem', minHeight: '80vh', padding: '2rem 0' }}>
      
      {/* SIDEBAR DE NAVIGATION */}
      <div style={{ width: '250px', background: 'rgba(11, 16, 26, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', height: 'fit-content' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Menu Système</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'dashboard', icon: <FaServer />, label: 'Serveur' },
            { id: 'tickets', icon: <FaTicketAlt />, label: 'Support & Tickets' },
            { id: 'lore', icon: <FaBook />, label: 'Lore & Univers' },
            { id: 'rules', icon: <FaGavel />, label: 'Règlement' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', border: 'none', textAlign: 'left', fontWeight: 'bold', transition: 'all 0.3s',
                background: activeTab === tab.id ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#00E5FF' : '#94A3B8',
                borderLeft: activeTab === tab.id ? '3px solid #00E5FF' : '3px solid transparent'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU CENTRAL DYNAMIQUE */}
      <div style={{ flex: 1, background: 'rgba(11, 16, 26, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            
            {/* VUE DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>État du Serveur</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Joueurs en ligne</div>
                    <div style={{ fontSize: '2.5rem', color: '#00e676', fontWeight: '900' }}>104<span style={{fontSize: '1.2rem', color: '#666'}}>/128</span></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Ping Serveur</div>
                    <div style={{ fontSize: '2.5rem', color: '#FFF', fontWeight: '900' }}>24 <span style={{fontSize: '1.2rem', color: '#666'}}>ms</span></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Prochain Reboot</div>
                    <div style={{ fontSize: '2.5rem', color: '#FFF', fontWeight: '900' }}>04:00</div>
                  </div>
                </div>
              </div>
            )}

            {/* VUE TICKETS */}
            {activeTab === 'tickets' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '2.5rem' }}>Support Joueur</h1>
                  <button style={{ padding: '10px 20px', background: '#00E5FF', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPlus /> Créer un ticket
                  </button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FaTicketAlt style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }} />
                  <h3>Aucun ticket actif</h3>
                  <p>Tous vos problèmes ont été résolus ou vous n'avez pas encore fait de demande.</p>
                </div>
              </div>
            )}

            {/* VUE LORE & RÈGLES */}
            {(activeTab === 'lore' || activeTab === 'rules') && (
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#00E5FF' }}>
                  {activeTab === 'lore' ? 'Le Lore de Tenkai' : 'Règlement du Serveur'}
                </h1>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.8', color: '#CBD5E1' }}>
                  <p>Nous sommes dans l'ère de la grande piraterie...</p>
                  <p><em>(Le texte complet de votre serveur sera inséré ici. Vous pourrez y mettre des titres, des images, et toutes les règles nécessaires au Roleplay.)</em></p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}