import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext'; 
import './Panel.css'; 

import { FaSteam, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';

import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import TopBar from './components/TopBar';
import Modals from './components/Modals';

import DashboardView from './views/DashboardView';
import TicketsView from './views/TicketsView';
import ProfileView from './views/ProfileView';
import LoreView from './views/LoreView';
import SettingsView from './views/SettingsView';

function SecurityGate({ login }) {
  return (
    <div style={{ 
      width: '100%', minHeight: '85vh', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      padding: '2rem', boxSizing: 'border-box'
    }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          background: 'rgba(10, 15, 25, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '3rem 2rem',
          width: '100%',
          maxWidth: '450px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ 
          width: '60px', height: '60px', background: 'rgba(0, 229, 255, 0.1)', 
          borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: '0 auto 1.5rem auto', border: '1px solid rgba(0, 229, 255, 0.3)'
        }}>
          <FaShieldAlt size={24} color="#00E5FF" />
        </div>

        <h2 style={{ color: '#FFF', fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
          Accès Restreint
        </h2>
        
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2.5rem' }}>
          Une vérification d'identité est requise. Veuillez vous connecter avec votre compte Steam pour accéder au Panel Joueur.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn-steam" 
            onClick={login}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
          >
            <FaSteam size={20} /> <span>Connexion via Steam</span>
          </button>

          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', 
              color: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', 
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
              transition: '0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#FFF'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >
            <FaArrowLeft size={14} /> Retour à l'accueil
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SecurePanelContent({ user }) {
  const { apiFetch, refreshUser } = useStore();
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);

  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = 'auto'; };
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      const res = await apiFetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (err) { console.error('Error loading tickets:', err); }
  }, [apiFetch]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('discord') === 'linked') {
      refreshUser();
      window.history.replaceState({}, '', '/panel');
    }
    if (params.get('error')) {
      console.error('Panel error:', params.get('error'));
      window.history.replaceState({}, '', '/panel');
    }
  }, [refreshUser]);

  const navigateToProfile = (steamId) => {
    setViewingProfile(steamId);
    setActiveView('profile');
  };

  const announcements = [
    { id: 1, type: "RP", title: "SAISON 1 : WANO KUNI", desc: "Les inscriptions pour les factions samouraïs sont officiellement ouvertes." }
  ];

  const fadeVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } }
  };

  return (
    <section style={{ padding: '4rem 2rem 8rem 2rem', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div className="tk-core-os">
        
        <SidebarLeft 
          activeView={activeView} setActiveView={setActiveView} 
          setIsTicketModalOpen={setIsTicketModalOpen} 
          ticketCount={tickets.filter(t => t.status !== 'Fermé').length}
          navigateToProfile={navigateToProfile}
          userSteamId={user.steamId}
        />

        <main className="tk-liquid-glass tk-center-hub" style={{ height: '100%', borderRadius: '16px', overflow: 'hidden', padding: '0px', display: 'flex', flexDirection: 'column' }}>
          
          <TopBar 
            activeView={activeView} setActiveView={setActiveView} 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            announcements={announcements} user={user}
            navigateToProfile={navigateToProfile}
          />

          <div style={{ flex: 1, position: 'relative', padding: '1rem', boxSizing: 'border-box' }}>
            <AnimatePresence mode="wait">
              {activeView === 'home' && <DashboardView key="home" variants={fadeVariants} announcements={announcements} />}
              {activeView === 'profile' && (
                <ProfileView 
                  key="profile" variants={fadeVariants} 
                  viewingSteamId={viewingProfile || user.steamId}
                  isOwnProfile={!viewingProfile || viewingProfile === user.steamId}
                  bannerInputRef={bannerInputRef} avatarInputRef={avatarInputRef}
                  navigateToProfile={navigateToProfile}
                />
              )}
              {activeView === 'tickets' && (
                <TicketsView 
                  key="tickets" variants={fadeVariants} 
                  tickets={tickets} setTickets={setTickets}
                  searchQuery={searchQuery} setIsTicketModalOpen={setIsTicketModalOpen}
                />
              )}
              {(activeView === 'rules' || activeView === 'lore') && <LoreView key="docs" variants={fadeVariants} activeView={activeView} />}
              {activeView === 'settings' && <SettingsView key="settings" variants={fadeVariants} />}
            </AnimatePresence>
          </div>
        </main>

        <SidebarRight searchQuery={searchQuery} />

      </div>

      <Modals 
        isTicketModalOpen={isTicketModalOpen} setIsTicketModalOpen={setIsTicketModalOpen}
        isDiscordModalOpen={isDiscordModalOpen} setIsDiscordModalOpen={setIsDiscordModalOpen}
        setTickets={setTickets} setActiveView={setActiveView}
      />

      <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
      <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
    </section>
  );
}

export default function Panel() {
  const { isLoggedIn, login, user, authLoading } = useStore();

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) window.location.reload(); 
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

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

  if (!isLoggedIn || !user) {
    return <SecurityGate login={login} />;
  }

  return <SecurePanelContent user={user} />;
}
