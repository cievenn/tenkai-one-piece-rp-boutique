import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext'; 
import './Panel.css'; 

import { FaSteam, FaShieldAlt, FaArrowLeft, FaLink } from 'react-icons/fa';

import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import TopBar from './components/TopBar';
import Modals from './components/Modals';

import DashboardView from './views/DashboardView';
import TicketsView from './views/TicketsView';
import ProfileView from './views/ProfileView';
import RulesView from './views/RulesView';
import LoreView from './views/LoreView';
import SettingsView from './views/SettingsView';

function SecurityGate({ login }) {
  return (
    <div style={{ width: '100%', minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ background: 'rgba(10, 15, 25, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '3rem 2rem', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
      >
        <div style={{ width: '60px', height: '60px', background: 'rgba(88, 101, 242, 0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto', border: '1px solid rgba(88, 101, 242, 0.3)' }}>
          <FaShieldAlt size={24} color="#5865F2" />
        </div>
        <h2 style={{ color: '#FFF', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Accès Restreint</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2.5rem' }}>
          Connectez-vous avec votre compte Discord pour accéder au Panel Joueur Tenkai.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn-discord" onClick={login} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            Connexion via Discord
          </button>
          <button onClick={() => window.location.href = '/'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, transition: '0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#FFF'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
            <FaArrowLeft size={14} /> Retour à l'accueil
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const STEAM_ERRORS = {
  not_authenticated: 'Session expirée. Reconnectez-vous avec Discord.',
  steam_failed: 'La connexion Steam a échoué. Réessayez.',
  steam_no_profile: 'Profil Steam introuvable.',
  steam_no_user: 'Erreur de session. Reconnectez-vous.',
  steam_duplicate: 'Ce compte Steam est déjà lié à un autre utilisateur.',
  login_failed: 'Erreur lors de la mise à jour de la session.'
};

function LinkSteamGate({ user, linkSteam, onSkip }) {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error');
  const errorMsg = errorCode ? STEAM_ERRORS[errorCode] || 'Une erreur est survenue.' : null;

  return (
    <div style={{ width: '100%', minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ background: 'rgba(10, 15, 25, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '3rem 2rem', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <img 
            src={user?.discordAvatar || user?.avatarCustom || user?.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} 
            alt="Avatar" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #5865F2', objectFit: 'cover', boxShadow: '0 0 20px rgba(88, 101, 242, 0.4)' }}
          />
          <h2 style={{ color: '#FFF', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', marginTop: '1rem', fontWeight: 700 }}>
            {user?.displayName || user?.discordUsername || 'Joueur'}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Connecté via Discord</p>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          Liez votre compte Steam pour débloquer la boutique in-game et toutes les fonctionnalités du serveur.
        </p>
        {errorMsg && (
          <div style={{ background: 'rgba(255, 71, 87, 0.15)', border: '1px solid rgba(255, 71, 87, 0.4)', borderRadius: '10px', padding: '10px 14px', marginBottom: '1.5rem', color: '#ff4757', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={linkSteam}
            style={{ 
              width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #1b2838 0%, #2a475e 100%)', color: '#FFF', border: '1px solid #66c0f4',
              borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
              boxShadow: '0 5px 20px rgba(102, 192, 244, 0.3)', transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 192, 244, 0.4)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(102, 192, 244, 0.3)'; }}
          >
            <FaSteam size={22} /> Connecter Steam
          </button>
          <button 
            onClick={onSkip}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, transition: '0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#FFF'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            Continuer sans Steam
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SteamLinkBanner({ linkSteam }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '0 2rem', padding: '12px 20px', background: 'rgba(255, 168, 38, 0.08)', border: '1px solid rgba(255, 168, 38, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffa826', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
        <FaLink /> Liez votre compte Steam pour débloquer toutes les fonctionnalités GMod.
      </div>
      <button onClick={linkSteam} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', transition: '0.2s', flexShrink: 0 }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
        <FaSteam /> Lier Steam
      </button>
    </motion.div>
  );
}

function SecurePanelContent({ user }) {
  const { apiFetch, refreshUser, linkSteam } = useStore();
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [preselectedCategory, setPreselectedCategory] = useState('');

  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => { document.body.style.overflowX = 'hidden'; return () => { document.body.style.overflowX = 'auto'; }; }, []);

  const loadTickets = useCallback(async () => {
    try {
      const res = await apiFetch('/api/tickets');
      if (res.ok) { const data = await res.json(); setTickets(data.tickets); }
    } catch (err) { console.error('Error loading tickets:', err); }
  }, [apiFetch]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('discord') === 'linked') refreshUser();
  }, [refreshUser]);

  const navigateToProfile = (profileId) => { setViewingProfile(profileId); setActiveView('profile'); };

  const openTicketWithCategory = (category) => {
    setPreselectedCategory(category);
    setIsTicketModalOpen(true);
  };

  const fadeVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } }
  };

  return (
    <section style={{ padding: '4rem 2rem 8rem 2rem', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div className="tk-core-os">
        <SidebarLeft activeView={activeView} setActiveView={setActiveView} setIsTicketModalOpen={setIsTicketModalOpen} ticketCount={tickets.filter(t => t.status !== 'Fermé').length} navigateToProfile={navigateToProfile} userId={user.id} />

        <main className="tk-liquid-glass tk-center-hub" style={{ height: '100%', borderRadius: '16px', overflow: 'hidden', padding: '0px', display: 'flex', flexDirection: 'column' }}>
          <TopBar activeView={activeView} setActiveView={setActiveView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} user={user} navigateToProfile={navigateToProfile} />
          
          {!user.steamLinked && <SteamLinkBanner linkSteam={linkSteam} />}

          <div style={{ flex: 1, position: 'relative', padding: '1rem', boxSizing: 'border-box' }}>
            <AnimatePresence mode="wait">
              {activeView === 'home' && <DashboardView key="home" variants={fadeVariants} />}
              {activeView === 'profile' && (
                <ProfileView key="profile" variants={fadeVariants} viewingProfileId={viewingProfile || user.id} isOwnProfile={!viewingProfile || viewingProfile === user.id} bannerInputRef={bannerInputRef} avatarInputRef={avatarInputRef} navigateToProfile={navigateToProfile} />
              )}
              {activeView === 'tickets' && (
                <TicketsView key="tickets" variants={fadeVariants} tickets={tickets} setTickets={setTickets} searchQuery={searchQuery} setIsTicketModalOpen={setIsTicketModalOpen} openTicketWithCategory={openTicketWithCategory} />
              )}
              {activeView === 'rules' && <RulesView key="rules" variants={fadeVariants} />}
              {activeView === 'lore' && <LoreView key="lore" variants={fadeVariants} />}
              {activeView === 'settings' && <SettingsView key="settings" variants={fadeVariants} />}
            </AnimatePresence>
          </div>
        </main>

        <SidebarRight searchQuery={searchQuery} />
      </div>

      <Modals isTicketModalOpen={isTicketModalOpen} setIsTicketModalOpen={setIsTicketModalOpen} isDiscordModalOpen={isDiscordModalOpen} setIsDiscordModalOpen={setIsDiscordModalOpen} setTickets={setTickets} setActiveView={setActiveView} preselectedCategory={preselectedCategory} setPreselectedCategory={setPreselectedCategory} />

      <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
      <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
    </section>
  );
}

export default function Panel() {
  const { isLoggedIn, login, user, authLoading, linkSteam, refreshUser } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get('step');
  const justLinkedSteam = searchParams.get('steam') === 'linked';

  useEffect(() => {
    const handlePageShow = (e) => { if (e.persisted) window.location.reload(); };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    if (justLinkedSteam) {
      refreshUser();
      setSearchParams({}, { replace: true });
    }
  }, [justLinkedSteam, refreshUser, setSearchParams]);

  const handleSkipSteam = () => {
    setSearchParams({}, { replace: true });
  };

  if (authLoading) {
    return (
      <div style={{ width: '100%', minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,229,255,0.2)', borderTop: '3px solid #00E5FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style dangerouslySetInnerHTML={{__html: '@keyframes spin { to { transform: rotate(360deg); } }'}} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit, sans-serif' }}>Vérification en cours...</p>
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn || !user) return <SecurityGate login={login} />;

  if (justLinkedSteam) return <SecurePanelContent user={user} />;
  if (step === 'link-steam' && !user.steamLinked) {
    return <LinkSteamGate user={user} linkSteam={linkSteam} onSkip={handleSkipSteam} />;
  }

  return <SecurePanelContent user={user} />;
}
