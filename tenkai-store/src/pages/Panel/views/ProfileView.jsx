import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaClock, FaShieldAlt, FaGamepad, FaCommentDots, FaPaperPlane } from 'react-icons/fa';

export default function ProfileView({ variants, currentUser, setCurrentUser, bannerInputRef, avatarInputRef }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([{ id: Date.now(), author: currentUser.pseudo, avatar: currentUser.avatar, time: "À l'instant", text: newCommentText }, ...comments]);
    setNewCommentText('');
  };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '3rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        <div className="tk-hover-edit" style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => bannerInputRef.current.click()}>
          <img src={currentUser.banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} onError={(e)=>e.target.src='https://via.placeholder.com/1500x400/0F3B4E/FFF?text=BANNIÈRE'} />
          <div className="tk-edit-layer"><FaCamera size="3.5rem" style={{marginBottom: '15px'}}/> MODIFIER LA BANNIÈRE</div>
          
          <div className="tk-hover-edit" style={{ position: 'absolute', bottom: '-60px', left: '50px', width: '180px', height: '180px', borderRadius: '50%', border: '8px solid #071521', zIndex: 10, boxShadow: '0 15px 50px rgba(0,0,0,0.9)' }} onClick={(e) => { e.stopPropagation(); avatarInputRef.current.click(); }}>
            <img src={currentUser.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            <div className="tk-edit-layer" style={{ borderRadius: '50%' }}><FaCamera size="2.5rem" /></div>
          </div>
        </div>

        <div style={{ padding: '0 50px', marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="tk-text-metal" style={{ fontSize: '4.5rem', margin: '0 0 15px 0', lineHeight: 0.9 }}>{currentUser.pseudo}</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span className="tk-badge tk-badge-success" style={{ padding: '10px 25px', fontSize: '1.1rem' }}>{currentUser.role}</span>
              <span className="tk-badge tk-badge-staff" style={{ padding: '10px 25px', fontSize: '1.1rem' }}>{currentUser.faction}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
            <FaClock style={{ fontSize: '3rem', color: '#B0B5B9', marginBottom: '15px' }}/>
            <div className="tk-text-metal" style={{ fontSize: '3rem' }}>{currentUser.playtime}</div>
            <div className="tk-text-muted tk-tech-font" style={{ fontSize: '1.1rem', letterSpacing: '3px', marginTop: '10px' }}>Temps de jeu</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
            <FaShieldAlt style={{ fontSize: '3rem', color: '#00E5FF', marginBottom: '15px', filter: 'drop-shadow(0 0 20px #00E5FF)' }}/>
            <div className="tk-text-metal" style={{ fontSize: '3rem' }}>{currentUser.joinDate}</div>
            <div className="tk-text-muted tk-tech-font" style={{ fontSize: '1.1rem', letterSpacing: '3px', marginTop: '10px' }}>IDENTIFICATION</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
            <FaGamepad style={{ fontSize: '3rem', color: '#00e676', marginBottom: '15px', filter: 'drop-shadow(0 0 20px #00e676)' }}/>
            <div className="tk-text-metal" style={{ fontSize: '3rem', color: '#00e676', textShadow: '0 0 20px rgba(0,230,118,0.5)' }}>100%</div>
            <div className="tk-text-muted tk-tech-font" style={{ fontSize: '1.1rem', letterSpacing: '3px', marginTop: '10px' }}>FIABILITÉ RP</div>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3 className="tk-text-metal" style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}><FaCommentDots className="tk-text-cyan"/> JOURNAL DE BORD</h3>
          <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
            <input type="text" placeholder="Ajouter une trace sur ce profil..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '20px 30px', color: '#FFF', outline: 'none', fontFamily: 'Inter', fontSize: '1.15rem', transition: '0.3s' }} onFocus={(e)=>e.target.style.borderColor='#00E5FF'} onBlur={(e)=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            <button type="submit" className="tk-btn-primary" style={{ padding: '0 50px', borderRadius: '20px', fontSize: '1.4rem' }}><FaPaperPlane /></button>
          </form>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.length === 0 ? <div className="tk-text-muted" style={{ textAlign: 'center', padding: '3rem', fontStyle: 'italic', fontSize: '1.1rem' }}>Aucune trace enregistrée dans les logs.</div> : null}
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div key={comment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={comment.avatar} style={{ width: '50px', height: '50px', borderRadius: '12px' }} alt="A" />
                      <strong className="tk-text-cyan" style={{ fontSize: '1.3rem' }}>{comment.author}</strong>
                    </div>
                    <span className="tk-text-muted" style={{ fontSize: '1rem' }}>{comment.time}</span>
                  </div>
                  <p style={{ margin: 0, color: '#FFF', lineHeight: 1.6, fontSize: '1.1rem' }}>{comment.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}