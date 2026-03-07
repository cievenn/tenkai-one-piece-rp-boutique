import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CHAPTERS = [
  {
    id: 1, title: 'Les Origines de Tenkai',
    banner: '/bg_op.webp',
    content: [
      "Il y a bien longtemps, à l'ère du vide, un événement cataclysmique a remodelé le monde tel que nous le connaissons. Les océans se sont divisés en quatre mers, séparées par une immense chaîne montagneuse : Red Line. Au cœur de ce nouveau monde, une route légendaire a émergé — Grand Line, le cimetière des rêves et le berceau des légendes.",
      "Tenkai est né de cette fracture. Un archipel perdu entre les courants du Nouveau Monde, découvert par hasard par un équipage dont l'histoire a été effacée des registres officiels. Les premiers habitants de Tenkai étaient des naufragés, des renégats et des rêveurs — tous unis par un même refus : celui de se plier aux lois du Gouvernement Mondial.",
      "Pendant des décennies, Tenkai s'est développé dans l'ombre. Un port libre, un marché noir florissant, et une société construite sur un principe simple : ici, c'est la volonté qui fait loi. Les Marines ont tenté à plusieurs reprises de soumettre l'île, mais la géographie traîtresse de l'archipel et la résistance acharnée de ses habitants ont transformé chaque tentative en humiliation.",
      "Aujourd'hui, Tenkai est devenu bien plus qu'une île. C'est un symbole. Un phare pour tous ceux qui refusent de baisser la tête. Pirates, révolutionnaires, marchands, chasseurs de primes — tous convergent vers cet endroit où le destin se forge à coups de poing et de conviction."
    ]
  },
  {
    id: 2, title: 'Les Factions de Tenkai',
    banner: '/bg_op.webp',
    content: [
      "L'équilibre de Tenkai repose sur un système de factions qui se disputent le contrôle de l'archipel. Chaque faction possède ses propres territoires, ses propres règles, et ses propres ambitions. L'affrontement entre elles est constant, parfois violent, mais toujours encadré par un code d'honneur tacite qui empêche la destruction totale.",
      "Les Équipages Pirates sont les plus nombreux et les plus diversifiés. Chaque capitaine forge son propre chemin, recrute ses propres nakamas, et rêve de trouver le One Piece. Certains sont des héros, d'autres des tyrans — mais tous sont libres. Les équipages sont classés par leur prime collective, un indicateur de leur dangerosité et de leur influence.",
      "La Marine de Tenkai est un détachement semi-autonome, souvent en conflit avec le QG central. Ses officiers doivent jongler entre les ordres du Gouvernement Mondial et la réalité du terrain. Certains sont des justiciers sincères, d'autres cachent des ambitions bien plus sombres derrière leur uniforme blanc.",
      "Le Marché de l'Ombre contrôle le commerce souterrain. Armes, fruits du démon, informations — tout a un prix. Ses membres sont des marchands, des espions et des courtiers en influence. Personne ne connaît le vrai leader du Marché, connu uniquement sous le nom de « Le Courtier ».",
      "Enfin, les Révolutionnaires opèrent depuis les catacombes sous l'île principale. Leur objectif : renverser l'ordre établi, y compris à Tenkai. Leur présence est un secret de polichinelle, et leur chef local reste dans l'ombre, attendant le moment parfait pour frapper."
    ]
  }
];

export default function LoreView({ variants }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const chapter = CHAPTERS[currentChapter];

  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="tk-scroll-zone-main" style={{ position: 'absolute', inset: 0, padding: '2rem' }}>
      
      <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
        <img src={chapter.banner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(1.3)' }} onError={(e)=>e.target.src='/bg_op.webp'} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,4,8,1) 0%, rgba(2,4,8,0) 60%)' }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', zIndex: 2 }}>
          <div className="tk-tech-font" style={{ color: '#00E5FF', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '6px' }}>CHAPITRE {chapter.id}</div>
          <h1 className="tk-text-metal" style={{ fontSize: '2.2rem', margin: 0 }}>{chapter.title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {chapter.content.map((paragraph, idx) => (
          <p key={idx} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif', textAlign: 'justify' }}>
            {paragraph}
          </p>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '2rem', paddingBottom: '2rem' }}>
        <button onClick={() => setCurrentChapter(c => Math.max(0, c - 1))} disabled={currentChapter === 0} style={{ width: '40px', height: '40px', borderRadius: '10px', background: currentChapter === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,229,255,0.1)', border: `1px solid ${currentChapter === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,229,255,0.3)'}`, color: currentChapter === 0 ? 'rgba(255,255,255,0.2)' : '#00E5FF', cursor: currentChapter === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
          <FaChevronLeft size={14} />
        </button>

        {CHAPTERS.map((ch, idx) => (
          <button key={ch.id} onClick={() => setCurrentChapter(idx)} style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: idx === currentChapter ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${idx === currentChapter ? '#00E5FF' : 'rgba(255,255,255,0.06)'}`,
            color: idx === currentChapter ? '#00E5FF' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'Orbitron, sans-serif',
            transition: '0.2s', boxShadow: idx === currentChapter ? '0 0 12px rgba(0,229,255,0.3)' : 'none'
          }}>
            {ch.id}
          </button>
        ))}

        <button onClick={() => setCurrentChapter(c => Math.min(CHAPTERS.length - 1, c + 1))} disabled={currentChapter === CHAPTERS.length - 1} style={{ width: '40px', height: '40px', borderRadius: '10px', background: currentChapter === CHAPTERS.length - 1 ? 'rgba(255,255,255,0.02)' : 'rgba(0,229,255,0.1)', border: `1px solid ${currentChapter === CHAPTERS.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(0,229,255,0.3)'}`, color: currentChapter === CHAPTERS.length - 1 ? 'rgba(255,255,255,0.2)' : '#00E5FF', cursor: currentChapter === CHAPTERS.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
          <FaChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
