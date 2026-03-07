import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaShieldAlt, FaSkull, FaTheaterMasks, FaBrain, FaHandshake, FaExclamationTriangle, FaUsers, FaGavel } from 'react-icons/fa';

const RULES = [
  { id: 1, icon: FaHandshake, color: '#00E5FF', title: 'Respect HRP', summary: 'Le respect entre joueurs est non-négociable, en jeu comme en dehors.',
    detail: 'Toute forme de harcèlement, insulte, discrimination ou toxicité HRP (Hors RolePlay) est strictement interdite. Cela inclut les messages vocaux, textuels, Discord et tout canal lié à la communauté Tenkai. Les sanctions vont du mute temporaire au bannissement définitif sans appel. La limite entre RP et HRP doit toujours être claire.' },
  { id: 2, icon: FaSkull, color: '#ff4757', title: 'Anti-RDM (Random Deathmatch)', summary: 'Toute agression non justifiée par un scénario RP est interdite.',
    detail: 'Il est interdit de tuer, blesser ou agresser un autre joueur sans raison RolePlay valable. Un minimum de 3 lignes de dialogue RP sont requises avant toute action hostile. Les sommations doivent être claires et laisser le temps de réagir (minimum 10 secondes). Les tueries de masse (Mass RDM) sont un motif de bannissement permanent.' },
  { id: 3, icon: FaBrain, color: '#c471ed', title: 'Anti-Métagaming', summary: 'Les informations obtenues hors RP ne peuvent pas être utilisées en jeu.',
    detail: 'Utiliser des informations apprises via Discord, le stream d\'un joueur, ou tout canal externe au RP pour avantager votre personnage est strictement interdit. Votre personnage ne sait que ce qu\'il a appris en jeu via des interactions RP légitimes. Le stream-sniping est considéré comme du métagaming aggravé.' },
  { id: 4, icon: FaTheaterMasks, color: '#FFD700', title: 'Anti-Powergaming', summary: 'Forcer des actions impossibles ou supprieures aux capacités de votre personnage.',
    detail: 'Vous ne pouvez pas forcer une action sur un autre joueur sans son consentement via /me. Les actions surhumaines sans fruit du démon valide sont interdites. Vous devez respecter les limites physiques et logiques de votre personnage. L\'esquive systématique de toute action hostile (Dodge RP) est du powergaming.' },
  { id: 5, icon: FaShieldAlt, color: '#00e676', title: 'Fear RP', summary: 'Votre personnage doit réagir de manière réaliste face au danger.',
    detail: 'Si votre personnage est en situation de danger mortel (arme pointée, en infériorité numérique massive), il doit agir en conséquence. Ignorer une menace armée crédible est une violation du Fear RP. Les personnages ayant une prime supérieure à 500M peuvent avoir un seuil de Fear RP réduit, mais pas nul.' },
  { id: 6, icon: FaExclamationTriangle, color: '#ff6b81', title: 'New Life Rule (NLR)', summary: 'Après une mort RP, votre personnage oublie les circonstances de sa mort.',
    detail: 'En cas de mort RP validée, votre personnage perd tout souvenir des 30 dernières minutes RP avant sa mort. Vous ne pouvez pas retourner sur le lieu de votre mort pendant 15 minutes réelles. Vous ne pouvez pas chercher vengeance sur la base de souvenirs effacés par la NLR. Les RPK (Permanent Kill) suivent des règles spécifiques via le système de tickets.' },
  { id: 7, icon: FaUsers, color: '#00b8ff', title: 'Règles de Faction', summary: 'Les factions doivent respecter leur hiérarchie et leurs objectifs RP.',
    detail: 'Chaque faction possède un chef et une hiérarchie interne qui doit être respectée en RP. Les trahisons de faction doivent être préparées RP et validées par un staff via ticket. Le recrutement dans une faction adverse est autorisé mais doit suivre un arc narratif cohérent. Les guerres de factions nécessitent une validation staff au préalable.' },
  { id: 8, icon: FaGavel, color: '#B0B5B9', title: 'Sanctions & Appels', summary: 'Système de sanctions progressif avec possibilité d\'appel.',
    detail: 'Les sanctions suivent un système progressif : Avertissement → Mute/Jail → Ban temporaire → Ban définitif. Toute sanction peut être contestée via le système de tickets (catégorie "Unban"). Les preuves vidéo/screenshot sont fortement recommandées pour toute contestation. Le staff se réserve le droit d\'appliquer des sanctions plus sévères en cas de récidive ou de gravité exceptionnelle.' }
];

export default function RulesView({ variants }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '2rem' }}>
      <h1 className="tk-text-metal" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>RÈGLEMENT OFFICIEL</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem' }}>Cliquez sur une règle pour consulter les détails. L'ignorance du règlement ne constitue pas une excuse.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
        {RULES.map(rule => {
          const Icon = rule.icon;
          const isOpen = expandedId === rule.id;
          return (
            <motion.div key={rule.id} layout onClick={() => setExpandedId(isOpen ? null : rule.id)} style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
              border: `1px solid ${isOpen ? `${rule.color}50` : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.3s',
              borderTop: `2px solid ${rule.color}${isOpen ? '' : '40'}`,
              boxShadow: isOpen ? `0 0 20px ${rule.color}15` : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${rule.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${rule.color}30` }}>
                  <Icon size={18} color={rule.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ color: '#FFF', fontWeight: 800, fontSize: '1rem', margin: 0, fontFamily: 'Outfit, sans-serif' }}>{rule.title}</h3>
                    <FaChevronDown size={12} color="rgba(255,255,255,0.3)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s', flexShrink: 0 }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>{rule.summary}</p>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: `1px solid ${rule.color}20` }}>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{rule.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
