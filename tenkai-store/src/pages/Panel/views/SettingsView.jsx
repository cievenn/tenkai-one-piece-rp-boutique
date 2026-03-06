import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaLink, FaUnlink, FaSave } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

export default function SettingsView({ variants }) {
  const { user, apiFetch, refreshUser, API_BASE } = useStore();
  const [settings, setSettings] = useState({ notifs: true, streamerMode: false });
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveBio = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await apiFetch('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ bio })
      });
      if (res.ok) {
        await refreshUser();
        setSaveMessage('Bio mise à jour avec succès.');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const data = await res.json();
        setSaveMessage(data.error || 'Erreur lors de la sauvegarde.');
      }
    } catch { setSaveMessage('Erreur réseau.'); }
    finally { setSaving(false); }
  };

  const handleDiscordLink = () => {
    window.location.href = `${API_BASE}/auth/discord`;
  };

  const handleDiscordUnlink = async () => {
    setUnlinking(true);
    try {
      const res = await apiFetch('/auth/discord/unlink', { method: 'POST' });
      if (res.ok) await refreshUser();
    } catch (err) { console.error('Error unlinking Discord:', err); }
    finally { setUnlinking(false); }
  };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '2.5rem' }}>
      <h2 className="tk-text-metal" style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>CONFIGURATION SYSTÈME</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', borderTop: '1px solid rgba(88,101,242,0.5)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#5865F2', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Outfit, sans-serif' }}>
            <FaDiscord size={22} /> Liaison Discord
          </h3>
          
          {user?.discordId ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', background: 'rgba(88,101,242,0.1)', borderRadius: '12px', border: '1px solid rgba(88,101,242,0.3)', marginBottom: '1rem' }}>
                {user.discordAvatar && (
                  <img src={user.discordAvatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                )}
                <div>
                  <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1.1rem' }}>{user.discordUsername}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Compte Discord lié</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: '#00e676', fontSize: '0.8rem', fontWeight: 700 }}>
                  <FaLink /> Connecté
                </div>
              </div>
              <button 
                onClick={handleDiscordUnlink} 
                disabled={unlinking}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)',
                  color: '#ff4757', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif', transition: '0.2s'
                }}
              >
                <FaUnlink /> {unlinking ? 'Déliaison...' : 'Délier le compte Discord'}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Liez votre compte Discord pour afficher votre pseudo et avatar Discord sur votre profil.
              </p>
              <button 
                onClick={handleDiscordLink}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#5865F2', border: 'none', color: '#FFF',
                  padding: '12px 24px', borderRadius: '12px', cursor: 'pointer',
                  fontWeight: 800, fontSize: '1rem', fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 5px 15px rgba(88,101,242,0.4)', transition: '0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}
              >
                <FaDiscord size={18} /> Lier mon compte Discord
              </button>
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', borderTop: '1px solid rgba(0,229,255,0.3)' }}>
          <h3 style={{ color: '#00E5FF', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Outfit, sans-serif' }}>Bio / Description</h3>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Parlez de vous..."
            style={{
              width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '14px 18px', color: '#FFF', outline: 'none',
              fontSize: '1rem', fontFamily: 'Outfit, sans-serif', resize: 'vertical', marginBottom: '1rem',
              boxSizing: 'border-box', transition: '0.3s'
            }}
            onFocus={(e)=>e.target.style.borderColor='rgba(0,229,255,0.4)'}
            onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.08)'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{bio.length}/500</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {saveMessage && <span style={{ color: saveMessage.includes('succès') ? '#00e676' : '#ff4757', fontSize: '0.85rem', fontWeight: 600 }}>{saveMessage}</span>}
              <button 
                onClick={handleSaveBio} disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #00E5FF, #0066cc)', border: 'none',
                  color: '#000', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 5px 15px rgba(0,229,255,0.3)', transition: '0.3s'
                }}
              >
                <FaSave /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div className="tk-premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' }}>
            <div>
              <h4 className="tk-tech-font" style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--cyan-neon, #00E5FF)' }}>NOTIFICATIONS</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Alertes sonores et visuelles.</p>
            </div>
            <div className={`tk-toggle-switch ${settings.notifs ? 'active' : ''}`} onClick={() => setSettings({...settings, notifs: !settings.notifs})}>
              <div className="tk-toggle-dot"></div>
            </div>
          </div>

          <div className="tk-premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' }}>
            <div>
              <h4 className="tk-tech-font" style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#00e676' }}>MODE STREAMER</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Masquer les informations sensibles.</p>
            </div>
            <div className={`tk-toggle-switch ${settings.streamerMode ? 'active' : ''}`} onClick={() => setSettings({...settings, streamerMode: !settings.streamerMode})}>
              <div className="tk-toggle-dot"></div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
