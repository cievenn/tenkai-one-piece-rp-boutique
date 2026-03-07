import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaSteam, FaTwitch, FaLink, FaUnlink, FaSave, FaUser, FaLock, FaPalette, FaBell, FaEnvelope } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

const TAB_CONFIG = [
  { id: 'account', label: 'Compte & Confidentialité', icon: FaUser, color: '#00E5FF', enabled: true },
  { id: 'linked', label: 'Comptes Liés', icon: FaLink, color: '#5865F2', enabled: true },
  { id: 'appearance', label: 'Apparence', icon: FaPalette, color: '#c471ed', enabled: false }
];

export default function SettingsView({ variants }) {
  const { user, apiFetch, refreshUser, linkSteam, API_BASE } = useStore();
  const [activeTab, setActiveTab] = useState('account');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [notifDiscord, setNotifDiscord] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [unlinking, setUnlinking] = useState('');

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const res = await apiFetch('/api/users/me', { method: 'PATCH', body: JSON.stringify({ displayName, email, bio }) });
      if (res.ok) { await refreshUser(); setSaveMsg('Modifications sauvegardées.'); setTimeout(() => setSaveMsg(''), 3000); }
      else { const d = await res.json(); setSaveMsg(d.error || 'Erreur.'); }
    } catch { setSaveMsg('Erreur réseau.'); }
    finally { setSaving(false); }
  };

  const handleSteamUnlink = async () => {
    setUnlinking('steam');
    try { const res = await apiFetch('/auth/steam/unlink', { method: 'POST' }); if (res.ok) await refreshUser(); }
    catch (err) { console.error(err); }
    finally { setUnlinking(''); }
  };

  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' };
  const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: '#FFF', outline: 'none', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box', transition: '0.3s' };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '2rem' }}>
      <h2 className="tk-text-metal" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>PARAMÈTRES</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TAB_CONFIG.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => tab.enabled && setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px',
              background: isActive ? `${tab.color}15` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isActive ? `${tab.color}50` : 'rgba(255,255,255,0.06)'}`,
              color: !tab.enabled ? 'rgba(255,255,255,0.2)' : isActive ? tab.color : 'rgba(255,255,255,0.5)',
              cursor: tab.enabled ? 'pointer' : 'not-allowed', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', transition: '0.3s',
              opacity: tab.enabled ? 1 : 0.5
            }}>
              <Icon size={14} /> {tab.label} {!tab.enabled && <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Bientôt</span>}
            </button>
          );
        })}
      </div>

      <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeTab === 'account' && (
          <>
            <div style={{ ...cardStyle, borderTop: '1px solid rgba(0,229,255,0.3)' }}>
              <h3 style={{ color: '#00E5FF', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1.2rem 0', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}><FaUser size={16} /> Informations du compte</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>PSEUDO AFFICHÉ</label>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={32} style={inputStyle} onFocus={(e)=>e.target.style.borderColor='rgba(0,229,255,0.4)'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>EMAIL</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} onFocus={(e)=>e.target.style.borderColor='rgba(0,229,255,0.4)'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.08)'} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>BIO</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e)=>e.target.style.borderColor='rgba(0,229,255,0.4)'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.08)'} />
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>{bio.length}/500</span>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '1px solid rgba(255,168,38,0.3)' }}>
              <h3 style={{ color: '#ffa826', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}><FaBell size={16} /> Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}><FaDiscord color="#5865F2" /> Notifications via Bot Discord</div>
                  <div className={`tk-toggle-switch ${notifDiscord ? 'active' : ''}`} onClick={() => setNotifDiscord(!notifDiscord)}><div className="tk-toggle-dot"></div></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}><FaEnvelope color="#00E5FF" /> Notifications par Email</div>
                  <div className={`tk-toggle-switch ${notifEmail ? 'active' : ''}`} onClick={() => setNotifEmail(!notifEmail)}><div className="tk-toggle-dot"></div></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
              {saveMsg && <span style={{ color: saveMsg.includes('sauvegardées') ? '#00e676' : '#ff4757', fontSize: '0.85rem', fontWeight: 600 }}>{saveMsg}</span>}
              <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #00E5FF, #0066cc)', border: 'none', color: '#000', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif', boxShadow: '0 5px 15px rgba(0,229,255,0.3)' }}>
                <FaSave /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </>
        )}

        {activeTab === 'linked' && (
          <>
            <div style={{ ...cardStyle, borderTop: '1px solid rgba(88,101,242,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(88,101,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaDiscord size={24} color="#5865F2" /></div>
                  <div>
                    <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem' }}>Discord</div>
                    <div style={{ color: '#5865F2', fontSize: '0.85rem', fontWeight: 600 }}>{user?.discordUsername}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e676', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(0,230,118,0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(0,230,118,0.3)' }}><FaLink size={10} /> Connecté (Principal)</div>
              </div>
            </div>

            <div style={{ ...cardStyle, borderTop: '1px solid rgba(102,192,244,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(102,192,244,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaSteam size={24} color="#66c0f4" /></div>
                  <div>
                    <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem' }}>Steam</div>
                    <div style={{ color: user?.steamLinked ? '#66c0f4' : 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{user?.steamLinked ? user.steamUsername || user.steamId : 'Non lié'}</div>
                  </div>
                </div>
                {user?.steamLinked ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#00e676', fontSize: '0.8rem', fontWeight: 700 }}><FaLink size={10} /> Lié</span>
                    <button onClick={handleSteamUnlink} disabled={unlinking === 'steam'} style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff4757', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}><FaUnlink size={10} /> Délier</button>
                  </div>
                ) : (
                  <button onClick={linkSteam} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(102,192,244,0.15)', border: '1px solid rgba(102,192,244,0.4)', color: '#66c0f4', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', transition: '0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='rgba(102,192,244,0.25)'} onMouseOut={(e)=>e.currentTarget.style.background='rgba(102,192,244,0.15)'}>
                    <FaSteam /> Lier Steam
                  </button>
                )}
              </div>
            </div>

            {[{ name: 'Twitch', icon: FaTwitch, color: '#9146FF' }, { name: 'Kick', icon: null, color: '#53FC18' }].map(platform => (
              <div key={platform.name} style={{ ...cardStyle, opacity: 0.4, cursor: 'not-allowed' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${platform.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {platform.icon ? <platform.icon size={24} color={platform.color} /> : <span style={{ color: platform.color, fontWeight: 900, fontSize: '1.2rem' }}>K</span>}
                    </div>
                    <div>
                      <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem' }}>{platform.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Bientôt disponible</div>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>PROCHAINEMENT</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}
