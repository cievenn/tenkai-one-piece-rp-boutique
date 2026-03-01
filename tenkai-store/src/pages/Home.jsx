import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaCompass, FaFistRaised, FaUsers, FaServer, FaMapMarkedAlt, FaCopy, FaCheck, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// --- COMPOSANT PARTICULES (LUEURS GLOBALES) ---
const Particles = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // J'ai augmenté le nombre à 25 pour que ça remplisse bien tout l'écran
  const particles = Array.from({ length: 25 }); 
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * windowWidth, y: Math.random() * window.innerHeight + 100, opacity: Math.random() * 0.5 + 0.2, scale: Math.random() * 1.5 + 0.5 }}
          animate={{ y: [null, -200], opacity: [null, 0] }}
          transition={{ duration: Math.random() * 12 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
          style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', background: i % 2 === 0 ? '#00E5FF' : '#00e676', boxShadow: `0 0 12px ${i % 2 === 0 ? '#00E5FF' : '#00e676'}` }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [ipCopied, setIpCopied] = useState(false);

  // Animations
  const floatingAnimation = { y: [-10, 15, -10], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } };
  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } } };

  const copyIp = () => {
    navigator.clipboard.writeText("play.tenkai-rp.com"); 
    setIpCopied(true);
    setTimeout(() => setIpCopied(false), 3000);
  };

  return (
    <div style={{ overflowX: 'hidden', position: 'relative' }}>
      
      {/* ==========================================
          ARRIÈRE-PLAN GLOBAL & PARTICULES 
          (Visible sur TOUTE la page 100vh)
      ========================================== */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
        
        {/* LUEURS DE FOND NATURELLES */}
        <div style={{ position: 'absolute', top: '-50%', left: '-25%', width: '150vw', height: '150vw', background: 'radial-gradient(circle closest-side, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '-50%', right: '-25%', width: '150vw', height: '150vw', background: 'radial-gradient(circle closest-side, rgba(0, 230, 118, 0.05) 0%, rgba(0, 230, 118, 0) 100%)' }} />
        
        {/* LES PARTICULES SONT MAINTENANT ICI (Globale) */}
        <Particles />
      </div>

      {/* ==========================================
          SECTION 1 : HERO ABSOLU
      ========================================== */}
      <section className="page active" style={{ position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
        
        {/* Texte en Filigrane massif */}
        <div style={{ position: 'absolute', top: '15%', left: '2%', fontSize: '18vw', fontWeight: '900', color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.03)', zIndex: 0, pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
          TENKAI
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '4rem', position: 'relative', zIndex: 1 }}>
          
          <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ flex: '1 1 450px', maxWidth: '750px', zIndex: 10 }}>
            <motion.div variants={itemUp} style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <div onClick={copyIp} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 20px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '50px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.2)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.15)'; }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 10px #00E5FF', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#FFF', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.9rem' }}>play.tenkai-rp.com</span>
                {ipCopied ? <FaCheck color="#00e676" /> : <FaCopy color="#00E5FF" opacity="0.7" />}
              </div>
            </motion.div>

            <motion.h1 variants={itemUp} style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: '0.95', marginBottom: '1.5rem', fontWeight: '900', textTransform: 'uppercase' }}>
              <span style={{ color: 'transparent', WebkitTextStroke: '2px #FFF', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Domine</span><br />
              <span style={{ color: '#00E5FF', textShadow: '0 0 30px rgba(0, 229, 255, 0.4), 0 0 60px rgba(0, 229, 255, 0.2)' }}>Grand Line</span>
            </motion.h1>

            <motion.p variants={itemUp} style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '95%' }}>
              L'ère de la piraterie est à son apogée. Éveillez votre <strong style={{color: '#FFF'}}>Haki</strong>, forgez votre équipage et gravissez les échelons sur l'expérience Roleplay la plus ambitieuse.
            </motion.p>

            <motion.div variants={itemUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => window.location.href = 'steam://connect/TON_IP'} style={{ padding: '16px 35px', fontSize: '1.1rem', fontWeight: '900', color: '#000', background: '#00E5FF', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0, 229, 255, 0.4), inset 0 2px 0 rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 229, 255, 0.6), inset 0 2px 0 rgba(255,255,255,0.6)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 229, 255, 0.4), inset 0 2px 0 rgba(255,255,255,0.6)'; }}>
                <FaPlay /> Jouer Maintenant
              </button>
              <button onClick={() => navigate('/panel')} style={{ padding: '16px 35px', fontSize: '1.1rem', fontWeight: 'bold', color: '#FFF', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.5)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                <FaCompass /> Explorer le Panel
              </button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, type: "spring", bounce: 0.5, delay: 0.3 }} style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center', position: 'relative', height: 'clamp(350px, 60vh, 600px)', perspective: '1200px', width: '100%', minWidth: '300px' }}>
            <div style={{ position: 'absolute', bottom: '10%', width: '90%', maxWidth: '400px', height: '60%', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)', backdropFilter: 'blur(25px)', border: '1px solid rgba(0, 229, 255, 0.3)', borderTop: '2px solid rgba(255, 255, 255, 0.4)', borderRadius: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.8), inset 0 0 40px rgba(0, 229, 255, 0.1)', transform: 'rotateX(15deg) rotateY(-15deg)', zIndex: 1 }} />
            <motion.img animate={{ y: [-15, 10, -15] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} src="/render_accueil.webp" alt="Personnage" style={{ position: 'absolute', bottom: '12%', height: '115%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 25px rgba(0, 229, 255, 0.25))', pointerEvents: 'none' }} onError={(e) => e.target.src = 'https://via.placeholder.com/450x650/transparent/00E5FF?text=RENDER'} />
            <motion.div animate={floatingAnimation} style={{ position: 'absolute', top: '10%', right: '-5%', zIndex: 3 }}>
              <div style={{ background: 'rgba(11, 16, 26, 0.8)', border: '1px solid #00E5FF', padding: '10px 15px', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0, 229, 255, 0.2)', color: '#00E5FF', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', fontSize: '1rem' }}>
                 <FaServer /> Ping: 12ms
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2 : GRILLE BENTO (REMASTERISÉE À FOND)
      ========================================== */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 5% 6rem 5%', position: 'relative' }}>
        
        {/* Glow local derrière la grille */}
        <div style={{ position: 'absolute', top: '30%', left: '30%', width: '40%', height: '40%', background: 'radial-gradient(circle closest-side, rgba(0, 229, 255, 0.05) 0%, rgba(0, 229, 255, 0) 100%)', zIndex: 0, pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '900' }}>
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #FFF' }}>Plongez dans</span> <span style={{ color: '#00E5FF', textShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}>l'Univers</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.2rem' }}>Découvrez des fonctionnalités développées exclusivement pour l'élite.</p>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
          
          {/* --- CARTE 1 (LARGEUR TOTALE) --- */}
          <motion.div 
            initial="rest" whileHover="hover" animate="rest"
            variants={{ rest: { scale: 1, borderColor: "rgba(255,255,255,0.05)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }, hover: { scale: 1.01, borderColor: "rgba(0, 229, 255, 0.4)", boxShadow: "0 25px 60px rgba(0, 229, 255, 0.15)" } }}
            style={{ flex: '1 1 100%', position: 'relative', borderRadius: '30px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', minHeight: '350px' }}
          >
            <motion.div variants={{ rest: { scale: 1, filter: "brightness(0.7)" }, hover: { scale: 1.05, filter: "brightness(1)" } }} transition={{ duration: 0.6 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url('/bg_map.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.6) 60%, rgba(3,7,18,0) 100%)', zIndex: 1 }} />
            
            <motion.div 
              variants={{ rest: { x: 0 }, hover: { x: 15 } }} transition={{ duration: 0.4 }}
              style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', zIndex: 2, maxWidth: '500px' }}
            >
              <motion.div variants={{ rest: { boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)', background: 'rgba(0, 229, 255, 0.05)' }, hover: { boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)', background: 'rgba(0, 229, 255, 0.15)' } }} style={{ width: '55px', height: '55px', border: '1px solid #00E5FF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: '#00E5FF', marginBottom: '1.2rem', transition: 'all 0.3s' }}>
                <FaMapMarkedAlt />
              </motion.div>
              <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#FFF', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase' }}>Monde Ouvert</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Naviguez à travers les mers, découvrez des îles légendaires reproduites avec un souci du détail maladif.</p>
              
              <motion.div variants={{ rest: { opacity: 0, x: -10 }, hover: { opacity: 1, x: 0 } }} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00E5FF', fontWeight: 'bold' }}>
                Explorer la carte <FaArrowRight />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* --- CARTE 2 (MOITIÉ) --- */}
          <motion.div 
            initial="rest" whileHover="hover" animate="rest"
            variants={{ rest: { scale: 1, borderColor: "rgba(255,255,255,0.05)" }, hover: { scale: 1.02, borderColor: "rgba(255, 204, 0, 0.4)" } }}
            style={{ flex: '1 1 350px', minHeight: '380px', position: 'relative', borderRadius: '30px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
          >
            <motion.div variants={{ rest: { scale: 1, filter: "brightness(0.7)" }, hover: { scale: 1.05, filter: "brightness(1)" } }} transition={{ duration: 0.6 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url('/bg_faction.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.3) 60%, rgba(3,7,18,0) 100%)', zIndex: 1 }} />
            
            <motion.div variants={{ rest: { y: 10 }, hover: { y: 0 } }} transition={{ duration: 0.4 }} style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 2 }}>
              <motion.div variants={{ rest: { filter: 'drop-shadow(0 0 5px rgba(255, 204, 0, 0.2))' }, hover: { filter: 'drop-shadow(0 0 15px rgba(255, 204, 0, 0.8))' } }}>
                <FaUsers style={{ fontSize: '2.5rem', color: '#ffcc00', marginBottom: '15px' }} />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', color: '#FFF', fontWeight: '900', marginBottom: '8px' }}>Factions</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', fontSize: '1.05rem' }}>Marine, Corsaires, ou Pirates. Écrivez votre propre légende.</p>
              
              <motion.div variants={{ rest: { opacity: 0, height: 0, marginTop: 0 }, hover: { opacity: 1, height: 'auto', marginTop: '1rem' } }} style={{ color: '#ffcc00', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                Rejoindre les rangs <FaArrowRight />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* --- CARTE 3 (MOITIÉ) --- */}
          <motion.div 
            initial="rest" whileHover="hover" animate="rest"
            variants={{ rest: { scale: 1, borderColor: "rgba(255,255,255,0.05)" }, hover: { scale: 1.02, borderColor: "rgba(0, 230, 118, 0.4)" } }}
            style={{ flex: '1 1 350px', minHeight: '380px', position: 'relative', borderRadius: '30px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
          >
            <motion.div variants={{ rest: { scale: 1, filter: "brightness(0.7)" }, hover: { scale: 1.05, filter: "brightness(1)" } }} transition={{ duration: 0.6 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url('/bg_combat.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.3) 60%, rgba(3,7,18,0) 100%)', zIndex: 1 }} />
            
            <motion.div variants={{ rest: { y: 10 }, hover: { y: 0 } }} transition={{ duration: 0.4 }} style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 2 }}>
              <motion.div variants={{ rest: { filter: 'drop-shadow(0 0 5px rgba(0, 230, 118, 0.2))' }, hover: { filter: 'drop-shadow(0 0 15px rgba(0, 230, 118, 0.8))' } }}>
                <FaFistRaised style={{ fontSize: '2.5rem', color: '#00e676', marginBottom: '15px' }} />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', color: '#FFF', fontWeight: '900', marginBottom: '8px' }}>Combats Dynamiques</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', fontSize: '1.05rem' }}>Maîtrisez les Fruits du Démon et éveillez le Haki des Rois.</p>
              
              <motion.div variants={{ rest: { opacity: 0, height: 0, marginTop: 0 }, hover: { opacity: 1, height: 'auto', marginTop: '1rem' } }} style={{ color: '#00e676', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                Devenir plus fort <FaArrowRight />
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ==========================================
          SECTION 3 : LA BULLE INSTABLE (LIQUID BLOB)
      ========================================== */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 2rem 6rem 2rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ width: '100%', maxWidth: '900px', position: 'relative' }}>
          
          <motion.div 
            animate={{ borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '100%', padding: '4rem 2rem', display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: '3rem', background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0.01) 100%)', border: '1px solid rgba(0, 229, 255, 0.15)', backdropFilter: 'blur(15px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(0, 229, 255, 0.1)', overflow: 'hidden' }}
          >
            <motion.div animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', top: '20%', left: '30%', width: '150px', height: '150px', background: 'rgba(0, 229, 255, 0.2)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />

            {[
              { value: "128", label: "Slots Joueurs" },
              { value: "24/7", label: "Disponibilité" },
              { value: "50+", label: "Fruits du Démon" }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '900', color: '#FFF', textShadow: '0 0 20px rgba(0, 229, 255, 0.5)' }}>{stat.value}</div>
                <div style={{ color: '#00E5FF', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}