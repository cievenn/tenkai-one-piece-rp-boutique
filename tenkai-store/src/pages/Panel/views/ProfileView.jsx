import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaClock, FaShieldAlt, FaCommentDots, FaPaperPlane, FaDiscord, FaSteam, FaTrash } from 'react-icons/fa';
import { useStore } from '../../../context/StoreContext';

export default function ProfileView({ variants, viewingSteamId, isOwnProfile, bannerInputRef, avatarInputRef, navigateToProfile }) {
  const { apiFetch, user, refreshUser, csrfToken, API_BASE } = useStore();
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      setLoading(true);
      setProfile(null);
      try {
        const res = await apiFetch(`/api/users/profile/${viewingSteamId}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
        
        const commentsRes = await apiFetch(`/api/users/profile/${viewingSteamId}/comments`);
        if (cancelled) return;
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData.comments);
        }
      } catch (err) { console.error('Error loading profile:', err); }
      finally { if (!cancelled) setLoading(false); }
    };
    loadProfile();
    return () => { cancelled = true; };
  }, [viewingSteamId, apiFetch]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || posting) return;
    setPosting(true);
    try {
      const res = await apiFetch(`/api/users/profile/${viewingSteamId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newCommentText })
      });
      if (res.ok) {
        const data = await res.json();
        setComments([data.comment, ...comments]);
        setNewCommentText('');
      }
    } catch (err) { console.error('Error posting comment:', err); }
    finally { setPosting(false); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await apiFetch(`/api/users/profile/comments/${commentId}`, { method: 'DELETE' });
      if (res.ok) setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) { console.error('Error deleting comment:', err); }
  };

  const handleFileUpload = async (field, file) => {
    if (!file || !isOwnProfile) return;
    const formData = new FormData();
    formData.append(field, file);
    
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'X-CSRF-Token': csrfToken || '' },
        body: formData
      });
      if (res.ok) {
        await refreshUser();
        const profileRes = await apiFetch(`/api/users/profile/${viewingSteamId}`);
        if (profileRes.ok) { const d = await profileRes.json(); setProfile(d.profile); }
      }
    } catch (err) { console.error('Upload error:', err); }
  };

  useEffect(() => {
    if (!isOwnProfile) return;
    
    const handleBannerChange = (e) => { if (e.target.files[0]) handleFileUpload('banner', e.target.files[0]); };
    const handleAvatarChange = (e) => { if (e.target.files[0]) handleFileUpload('avatar', e.target.files[0]); };
    
    const bannerEl = bannerInputRef?.current;
    const avatarEl = avatarInputRef?.current;
    
    bannerEl?.addEventListener('change', handleBannerChange);
    avatarEl?.addEventListener('change', handleAvatarChange);
    
    return () => {
      bannerEl?.removeEventListener('change', handleBannerChange);
      avatarEl?.removeEventListener('change', handleAvatarChange);
    };
  }, [isOwnProfile, bannerInputRef, avatarInputRef, viewingSteamId, csrfToken]);

  if (loading) {
    return (
      <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement du profil...</p>
      </motion.div>
    );
  }

  if (!profile) {
    return (
      <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Profil introuvable.</p>
      </motion.div>
    );
  }

  const displayAvatar = profile.avatar || user?.avatar || '';
  const displayBanner = profile.banner || '/bg_op.webp';
  const memberSince = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Inconnu';

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div 
          className={isOwnProfile ? 'tk-hover-edit' : ''} 
          style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }} 
          onClick={() => isOwnProfile && bannerInputRef?.current?.click()}
        >
          <img src={displayBanner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} onError={(e)=>e.target.src='/bg_op.webp'} />
          {isOwnProfile && <div className="tk-edit-layer"><FaCamera size="2.5rem" style={{marginBottom: '10px'}}/> MODIFIER LA BANNIÈRE</div>}
          
          <div 
            className={isOwnProfile ? 'tk-hover-edit' : ''} 
            style={{ position: 'absolute', bottom: '-50px', left: '40px', width: '140px', height: '140px', borderRadius: '50%', border: '6px solid #071521', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.9)', overflow: 'hidden' }} 
            onClick={(e) => { e.stopPropagation(); isOwnProfile && avatarInputRef?.current?.click(); }}
          >
            <img src={displayAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="Avatar" />
            {isOwnProfile && <div className="tk-edit-layer" style={{ borderRadius: '50%' }}><FaCamera size="2rem" /></div>}
          </div>
        </div>

        <div style={{ padding: '0 40px', marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="tk-text-metal" style={{ fontSize: '3rem', margin: '0 0 10px 0', lineHeight: 0.9 }}>{profile.username}</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="tk-badge tk-badge-success" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>{profile.role}</span>
              {profile.discordUsername && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5865F2', fontSize: '0.85rem', fontWeight: 600 }}>
                  <FaDiscord /> {profile.discordUsername}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                <FaSteam /> {profile.steamId}
              </span>
            </div>
            {profile.bio && (
              <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.5, maxWidth: '600px' }}>{profile.bio}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
            <FaClock style={{ fontSize: '2rem', color: '#B0B5B9', marginBottom: '10px' }}/>
            <div className="tk-text-metal" style={{ fontSize: '1.5rem' }}>{memberSince}</div>
            <div className="tk-text-muted tk-tech-font" style={{ fontSize: '0.85rem', letterSpacing: '2px', marginTop: '8px' }}>MEMBRE DEPUIS</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
            <FaShieldAlt style={{ fontSize: '2rem', color: '#00E5FF', marginBottom: '10px', filter: 'drop-shadow(0 0 15px #00E5FF)' }}/>
            <div className="tk-text-metal" style={{ fontSize: '1.5rem' }}>{profile.role}</div>
            <div className="tk-text-muted tk-tech-font" style={{ fontSize: '0.85rem', letterSpacing: '2px', marginTop: '8px' }}>RANG</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
            <FaCommentDots style={{ fontSize: '2rem', color: '#00e676', marginBottom: '10px', filter: 'drop-shadow(0 0 15px #00e676)' }}/>
            <div className="tk-text-metal" style={{ fontSize: '1.5rem', color: '#00e676', textShadow: '0 0 15px rgba(0,230,118,0.5)' }}>{profile.commentCount || 0}</div>
            <div className="tk-text-muted tk-tech-font" style={{ fontSize: '0.85rem', letterSpacing: '2px', marginTop: '8px' }}>COMMENTAIRES</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 className="tk-text-metal" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}><FaCommentDots className="tk-text-cyan"/> JOURNAL DE BORD</h3>
          
          <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" placeholder="Ajouter une trace sur ce profil..." 
              value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} 
              maxLength={300}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '14px 20px', color: '#FFF', outline: 'none', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', transition: '0.3s' }} 
              onFocus={(e)=>e.target.style.borderColor='#00E5FF'} 
              onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} 
            />
            <button type="submit" disabled={posting} className="tk-btn-primary" style={{ padding: '0 35px', borderRadius: '16px', fontSize: '1.2rem' }}><FaPaperPlane /></button>
          </form>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.length === 0 ? <div className="tk-text-muted" style={{ textAlign: 'center', padding: '2rem', fontStyle: 'italic' }}>Aucune trace enregistrée.</div> : null}
            <AnimatePresence>
              {comments.map((comment) => {
                const canDelete = comment.author_id === user?.id || (isOwnProfile && profile.id === user?.id) || user?.role === 'Admin';
                return (
                  <motion.div key={comment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={comment.author_avatar_custom || comment.author_avatar} 
                          style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' }} 
                          alt="A" 
                          onClick={() => navigateToProfile(comment.author_steam_id)}
                        />
                        <strong 
                          style={{ color: '#00E5FF', fontSize: '1rem', cursor: 'pointer' }}
                          onClick={() => navigateToProfile(comment.author_steam_id)}
                        >
                          {comment.author_name}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="tk-text-muted" style={{ fontSize: '0.8rem' }}>
                          {new Date(comment.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {canDelete && (
                          <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,71,87,0.5)', cursor: 'pointer', padding: '4px', transition: '0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#ff4757'} onMouseOut={(e) => e.currentTarget.style.color='rgba(255,71,87,0.5)'}>
                            <FaTrash size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: '#FFF', lineHeight: 1.5, fontSize: '0.95rem' }}>{comment.content}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
