import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStore, FaCopy, FaCheck, FaLock } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// --- COMPOSANT PARTICULES GLOBALES NÉON ---
const Particles = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particles = Array.from({ length: 25 }); 
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * windowWidth, y: Math.random() * window.innerHeight + 100, opacity: Math.random() * 0.5 + 0.2, scale: Math.random() * 1.5 + 0.5 }}
          animate={{ y: [null, -200], opacity: [null, 0] }}
          transition={{ duration: Math.random() * 12 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
          style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', background: i % 2 === 0 ? '#00E5FF' : '#00e676', boxShadow: `0 0 15px ${i % 2 === 0 ? '#00E5FF' : '#00e676'}` }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [ipCopied, setIpCopied] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- ÉTAT DU CAROUSEL 3D ---
  const [activeIdx, setActiveIdx] = useState(0);

  // --- DONNÉES DU MULTIVERS TENKAI (Minimalistes & Épurées) ---
  const servers = [
    { id: 0, status: "EN LIGNE", color: "#00E5FF", img: "bg_op.webp" },
    { id: 1, status: "COMING SOON", color: "#ffcc00", img: "bg_mystery1.webp" },
    { id: 2, status: "COMING SOON", color: "#ff4757", img: "bg_mystery2.webp" },
    { id: 3, status: "COMING SOON", color: "#a241f7", img: "bg_mystery3.webp" },
    { id: 4, status: "COMING SOON", color: "#00e676", img: "bg_mystery4.webp" }
  ];

  // Calcul du chemin le plus court pour la boucle infinie
  const getOffset = (index) => {
    const total = servers.length;
    let diff = index - activeIdx;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;
    return diff;
  };

  // Gestion du Swipe (Glisser tactile/souris)
  const handleDragEnd = (event, info) => {
    const swipeDistance = info.offset.x;
    if (swipeDistance < -40) setActiveIdx((prev) => (prev + 1) % servers.length); // Droite
    else if (swipeDistance > 40) setActiveIdx((prev) => (prev === 0 ? servers.length - 1 : prev - 1)); // Gauche
  };

  const copyIp = () => {
    navigator.clipboard.writeText("play.tenkai-rp.com"); 
    setIpCopied(true);
    setTimeout(() => setIpCopied(false), 3000);
  };

  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } } };

  // ================= PARAMÈTRES RESPONSIVE (Tailles dynamiques selon l'écran) =================
  let bubbleSize, radiusX, radiusZ, perspectiveVal, carouselHeight;
  if (windowWidth < 480) { // Petit Mobile
    bubbleSize = 220; radiusX = 130; radiusZ = 120; perspectiveVal = 800; carouselHeight = 350;
  } else if (windowWidth < 768) { // Grand Mobile / Tablette Verticale
    bubbleSize = 260; radiusX = 180; radiusZ = 160; perspectiveVal = 1000; carouselHeight = 400;
  } else if (windowWidth < 1024) { // Tablette Paysage / Petit PC
    bubbleSize = 300; radiusX = 280; radiusZ = 220; perspectiveVal = 1200; carouselHeight = 450;
  } else { // Desktop Classique & Ultrawide
    bubbleSize = 360; radiusX = 420; radiusZ = 320; perspectiveVal = 1500; carouselHeight = 500;
  }

  return (
    // Note : overflowX a été retiré ici pour libérer totalement la 3D
    <div style={{ position: 'relative', width: '100%' }}>
      
      {/* ARRIÈRE-PLAN GLOBAL */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-25%', width: '150vw', height: '150vw', background: 'radial-gradient(circle closest-side, rgba(0, 229, 255, 0.05) 0%, rgba(0, 229, 255, 0) 100%)' }} />
        <Particles />
      </div>

      {/* ==========================================
          SECTION 1 : HERO ABSOLU 
      ========================================== */}
      <section className="page active" style={{ position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center', paddingBottom: '20rem' }}>
        <div style={{ position: 'absolute', top: '15%', left: '2%', fontSize: 'clamp(6rem, 15vw, 15rem)', fontWeight: '900', color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.02)', zIndex: 0, pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
          TENKAI
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 'clamp(2rem, 4vw, 4rem)', position: 'relative', zIndex: 1 }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: '1 1 400px', maxWidth: '750px', zIndex: 10 }}>
            
            <motion.div variants={itemUp} style={{ display: 'inline-block', marginBottom: 'clamp(1rem, 3vw, 2rem)' }}>
              <div onClick={copyIp} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 20px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '50px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15)'; }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 10px #00E5FF', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#FFF', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.9rem' }}>play.tenkai-rp.com</span>
                {ipCopied ? <FaCheck color="#00e676" /> : <FaCopy color="#00E5FF" opacity="0.7" />}
              </div>
            </motion.div>

            <motion.h1 variants={itemUp} style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: '0.95', marginBottom: '1.5rem', fontWeight: '900', textTransform: 'uppercase' }}>
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #FFF', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Domine</span><br />
              <span style={{ color: '#00E5FF', textShadow: '0 0 30px rgba(0, 229, 255, 0.4), 0 0 60px rgba(0, 229, 255, 0.2)' }}>Grand Line</span>
            </motion.h1>

            <motion.p variants={itemUp} style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '95%' }}>
              L'ère de la piraterie est à son apogée. Éveillez votre <strong style={{color: '#FFF'}}>Haki</strong>, forgez votre équipage et gravissez les échelons sur l'expérience Roleplay la plus ambitieuse.
            </motion.p>

            <motion.div variants={itemUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => window.location.href = 'steam://connect/TON_IP'} style={{ padding: '16px 35px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: '900', color: '#000', background: '#00E5FF', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0, 229, 255, 0.4), inset 0 2px 0 rgba(255,255,255,0.6)', textTransform: 'uppercase', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; }}>
                <FaPlay /> Jouer Maintenant
              </button>
              <button onClick={() => document.getElementById('multiverse-section').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '16px 35px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 'bold', color: '#FFF', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.5)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                <FaStore /> Le Multivers
              </button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, type: "spring", bounce: 0.5, delay: 0.3 }} style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', height: 'clamp(300px, 50vh, 600px)', perspective: '1200px', width: '100%', minWidth: '250px' }}>
            <div style={{ position: 'absolute', bottom: '10%', width: '90%', maxWidth: '400px', height: '60%', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)', backdropFilter: 'blur(25px)', border: '1px solid rgba(0, 229, 255, 0.3)', borderTop: '2px solid rgba(255, 255, 255, 0.4)', borderRadius: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 0 40px rgba(0, 229, 255, 0.1)', transform: 'rotateX(15deg) rotateY(-15deg)', zIndex: 1 }} />
            <motion.img animate={{ y: [-15, 10, -15] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} src="/render_accueil.webp" alt="Personnage" style={{ position: 'absolute', bottom: '12%', height: '115%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 25px rgba(0, 229, 255, 0.25))', pointerEvents: 'none' }} onError={(e) => e.target.src = 'https://via.placeholder.com/450x650/transparent/00E5FF?text=RENDER'} />
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2 : LE MULTIVERS TENKAI (CYLINDRE SANS BORDURES/COUPURES)
      ========================================== */}
      <section id="multiverse-section" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* CONTENEUR DU CAROUSEL (DRAG & SWIPE ACTIF) */}
        <motion.div 
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: `${carouselHeight}px`, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            perspective: `${perspectiveVal}px`, 
            cursor: 'grab', 
            touchAction: 'none'
          }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {servers.map((server, idx) => {
            const offset = getOffset(idx);
            const isActive = offset === 0;
            const isSide = Math.abs(offset) === 1;
            
            // --- MATHÉMATIQUES DU CYLINDRE ---
            const angleDeg = offset * 72; // 360/5
            const angleRad = angleDeg * (Math.PI / 180);
            
            const xPos = Math.sin(angleRad) * radiusX;
            const zPos = Math.cos(angleRad) * radiusZ - radiusZ; 

            // Échelle et Opacité (Profondeur)
            const scaleAmount = 0.75 + (Math.cos(angleRad) * 0.25); 
            const opacityAmount = Math.max(0.1, 0.4 + (Math.cos(angleRad) * 0.6)); 
            const zIndexValue = Math.round(Math.cos(angleRad) * 100);

            // GESTION DU FLOU (Depth of Field) - Focus uniquement sur le centre
            const blurAmount = isActive ? 0 : isSide ? 4 : 8;

            return (
              <motion.div
                key={server.id}
                onClick={(e) => {
                  if (!isActive) {
                    e.stopPropagation();
                    setActiveIdx(idx);
                  } else if (server.status === "EN LIGNE") {
                    navigate('/rerolls'); // Redirection vers la boutique
                  }
                }}
                animate={{
                  x: xPos,
                  z: zPos,
                  scale: scaleAmount,
                  opacity: opacityAmount,
                  filter: `blur(${blurAmount}px)`
                }}
                transition={{ duration: 0.8, type: "spring", stiffness: 45, damping: 15 }}
                style={{
                  position: 'absolute',
                  zIndex: zIndexValue,
                  width: `${bubbleSize}px`,
                  height: `${bubbleSize}px`,
                  cursor: isActive && server.status === "EN LIGNE" ? 'pointer' : isActive ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'auto'
                }}
              >
                
                {/* ================= SYSTÈME SOLAIRE HOLOGRAPHIQUE ================= */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key={`holo-${server.id}`} /* CLÉ CRUCIALE POUR ÉVITER LE CRASH */
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
                    >
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotateX(75deg)', width: '108%', height: '108%' }}>
                        <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ width: '100%', height: '100%', border: `3px dotted ${server.color}80`, borderRadius: '50%', boxShadow: `0 0 15px ${server.color}40, inset 0 0 15px ${server.color}40` }} />
                      </div>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotateY(60deg) rotateX(20deg)', width: '106%', height: '106%' }}>
                        <motion.div animate={{ rotateZ: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ width: '100%', height: '100%', border: `2px dashed ${server.color}60`, borderRadius: '50%' }} />
                      </div>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotateX(45deg) rotateY(-45deg)', width: '112%', height: '112%' }}>
                        <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} style={{ width: '100%', height: '100%', border: `1px solid ${server.color}40`, borderRadius: '50%' }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ================= LA BULLE SPHÉRIQUE ================= */}
                <motion.div
                  animate={{
                    boxShadow: isActive 
                      ? [`0 0 30px ${server.color}80, inset 0 0 50px ${server.color}80`, `0 0 60px ${server.color}, inset 0 0 80px ${server.color}`]
                      : [`0 0 0px ${server.color}00, inset 0 0 15px ${server.color}30`, `0 0 0px ${server.color}00, inset 0 0 15px ${server.color}30`]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%', 
                    border: `2px solid ${isActive ? server.color : server.color + '40'}`,
                    overflow: 'hidden', 
                    zIndex: 1,
                  }}
                >
                  {/* L'IMAGE INTERNE : BLINDÉE CONTRE LES CRASHES */}
                  <motion.img 
                    src={`/${server.img}`}
                    alt="Fond du Serveur"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = `https://placehold.co/400x400/${server.color.replace('#', '')}/000000?text=CLASSIFIÉ`;
                    }}
                    animate={{
                      scale: isActive ? 1 : 1.4,
                      filter: isActive ? 'brightness(0.6)' : 'brightness(0.4)'
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ 
                      position: 'absolute', top: 0, left: 0, 
                      width: '100%', height: '100%', 
                      objectFit: 'cover', zIndex: 1 
                    }}
                  />

                  {/* Voile sombre pour texte */}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.1) 70%, transparent 100%)`, zIndex: 2 }} />
                  
                  {/* Reflet sphérique de verre */}
                  <div style={{ position: 'absolute', top: '5%', left: '15%', width: '40%', height: '30%', background: '#FFF', filter: 'blur(20px)', opacity: isActive ? 0.15 : 0.05, borderRadius: '50%', zIndex: 3 }} />
                </motion.div>

                {/* ================= CONTENU (HUD ULTRA-ÉPURÉ SANS TEXTE INUTILE) ================= */}
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
                  
                  {server.status === 'EN LIGNE' ? (
                    <motion.div 
                      animate={{ opacity: isActive ? 1 : 0.6 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <h3 style={{ 
                        color: '#FFF', fontSize: `clamp(1.5rem, ${windowWidth < 768 ? '6vw' : '2.5vw'}, 2.5rem)`, fontWeight: '900', 
                        textShadow: `0 0 30px ${server.color}, 0 0 60px ${server.color}`, margin: '0', 
                        textTransform: 'uppercase', textAlign: 'center', lineHeight: '1.1', letterSpacing: '2px' 
                      }}>
                        TENKAI<br/>
                        <span style={{ color: server.color }}>ONE PIECE</span>
                      </h3>
                    </motion.div>
                  ) : (
                    <motion.div 
                      animate={{ opacity: isActive ? 1 : 0.6 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <h3 style={{ 
                        color: '#FFF', fontSize: `clamp(1.2rem, ${windowWidth < 768 ? '5vw' : '2vw'}, 2rem)`, fontWeight: '900', 
                        textShadow: `0 0 20px rgba(255,255,255,0.5)`, margin: '0 0 0.5rem 0', 
                        textTransform: 'uppercase', textAlign: 'center', letterSpacing: '8px', opacity: 0.8 
                      }}>
                        TENKAI
                      </h3>
                      <div style={{ 
                        color: server.color, fontWeight: '900', textTransform: 'uppercase', 
                        fontSize: `clamp(0.8rem, ${windowWidth < 768 ? '3.5vw' : '1.1rem'}, 1.1rem)`, letterSpacing: '3px', textShadow: `0 0 20px ${server.color}`, 
                        display: 'flex', alignItems: 'center', gap: '10px' 
                      }}>
                        <FaLock style={{ fontSize: '1rem' }} /> COMING SOON
                      </div>
                    </motion.div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CONTRÔLES MANUELS EN BAS */}
        <div style={{ display: 'flex', gap: '15px', marginTop: 'clamp(2rem, 5vw, 5rem)', zIndex: 20 }}>
          {servers.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveIdx(idx)}
              style={{ 
                width: activeIdx === idx ? '40px' : '12px', height: '12px', borderRadius: '12px', 
                background: activeIdx === idx ? servers[idx].color : 'rgba(255,255,255,0.15)', 
                cursor: 'pointer', transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: activeIdx === idx ? `0 0 15px ${servers[idx].color}` : 'none'
              }} 
            />
          ))}
        </div>

      </section>

    </div>
  );
}