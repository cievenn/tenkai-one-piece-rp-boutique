import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import './Panel.css'; // Ton CSS isolé

// Composants
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import TopBar from './components/TopBar';
import Modals from './components/Modals';

// Vues
import DashboardView from './views/DashboardView';
import TicketsView from './views/TicketsView';
import ProfileView from './views/ProfileView';
import LoreView from './views/LoreView';
import SettingsView from './views/SettingsView';

export default function Panel() {
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // États Modales
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);

  // Sécurité anti-scroll horizontal
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = 'auto'; };
  }, []);

  // --- DONNÉES UTILISATEUR ---
  let steamUser = null;
  try {
    if (typeof useStore === 'function') {
      const store = useStore();
      steamUser = store?.user || store?.currentUser || null;
    }
  } catch (error) {
    console.warn("Contexte Steam en attente de liaison.");
  }

  const [currentUser, setCurrentUser] = useState({
    pseudo: steamUser?.name || "Pirate_99",
    role: "Capitaine",
    faction: "Armada Indépendante",
    playtime: "342h",
    joinDate: "Saison 1",
    avatar: steamUser?.avatar || "https://i.pravatar.cc/150?img=11",
    banner: "/bg_op.webp"
  });

  // --- DONNÉES PARTAGÉES ---
  const [serverPlayers] = useState([
    { id: 3, name: "Sanji_Kick", status: "online", role: "Cuisinier" },
    { id: 4, name: "UsoppGod", status: "dnd", role: "Sniper" },
    { id: 5, name: "Franky_Cyborg", status: "online", role: "Charpentier" },
    { id: 6, name: "Robin_Chwan", status: "online", role: "Archéologue" },
    { id: 7, name: "Jinbe_Boss", status: "online", role: "Timonier" }
  ]);

  const announcements = [
    { id: 1, type: "RP", title: "SAISON 1 : WANO KUNI", desc: "Les inscriptions pour les factions samouraïs sont officiellement ouvertes dans le channel dédié. Préparez vos backgrounds." },
    { id: 2, type: "STAFF", title: "CANDIDATURES STAFF OUVERTES", desc: "Recrutement Animateurs RP en cours. Déposez votre dossier rapidement sur notre discord." },
    { id: 3, type: "MAJ", title: "MISE À JOUR V2.0.4", desc: "Correction des bugs d'inventaire, ajout des nouveaux bateaux de guerre et équilibrage global du Haki." }
  ];

  const [tickets, setTickets] = useState([
    { 
      id: "TK-1042", title: "Candidature Homme-Poisson", status: "ouvert", type: "rp", date: "14:00",
      messages: [
        { sender: currentUser.pseudo, text: "Bonjour, ci-joint mon background pour la race Homme-Poisson.", time: "14:30", isMe: true },
        { sender: "Admin_Zoro", text: "Dossier bien reçu, nous l'analysons actuellement.", time: "15:05", isMe: false }
      ]
    }
  ]);

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
          setIsTicketModalOpen={setIsTicketModalOpen} setIsDiscordModalOpen={setIsDiscordModalOpen} 
        />

        <main className="tk-liquid-glass tk-center-hub">
          <TopBar activeView={activeView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} announcements={announcements} />

          <div style={{ flex: 1, position: 'relative' }}>
            <AnimatePresence mode="wait">
              {activeView === 'home' && <DashboardView key="home" variants={fadeVariants} announcements={announcements} serverPlayersCount={serverPlayers.length} />}
              {activeView === 'profile' && <ProfileView key="profile" variants={fadeVariants} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
              {activeView === 'tickets' && <TicketsView key="tickets" variants={fadeVariants} tickets={tickets} setTickets={setTickets} currentUser={currentUser} searchQuery={searchQuery} setIsTicketModalOpen={setIsTicketModalOpen} />}
              {(activeView === 'rules' || activeView === 'lore') && <LoreView key="docs" variants={fadeVariants} activeView={activeView} />}
              {activeView === 'settings' && <SettingsView key="settings" variants={fadeVariants} />}
            </AnimatePresence>
          </div>
        </main>

        <SidebarRight searchQuery={searchQuery} serverPlayers={serverPlayers} />

      </div>

      <Modals 
        isTicketModalOpen={isTicketModalOpen} setIsTicketModalOpen={setIsTicketModalOpen}
        isDiscordModalOpen={isDiscordModalOpen} setIsDiscordModalOpen={setIsDiscordModalOpen}
        setTickets={setTickets} setActiveView={setActiveView}
      />
    </section>
  );
}