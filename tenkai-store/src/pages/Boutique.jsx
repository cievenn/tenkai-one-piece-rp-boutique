import { useStore } from '../context/StoreContext';
import { FaGem, FaCrown } from 'react-icons/fa';

export default function Boutique() {
  const { addToCart } = useStore();

  const coins = [
    { name: "500 Tenkai Coins", price: 5.00, img: "coins_small.webp", isBest: false },
    { name: "1200 Tenkai Coins", price: 10.00, img: "coins_medium.webp", isBest: true },
    { name: "3000 Tenkai Coins", price: 20.00, img: "coins_large.webp", isBest: false }
  ];

  const grades = [
    { name: "Grade Corsaire", desc: "File x2, Salaire +25%", price: 10.00, img: "grade_corsaire.webp", theme: "theme-corsaire" },
    { name: "Grade Roi des Pirates", desc: "Bypass, Salaire +100%, VIP", price: 50.00, img: "grade_roi.webp", theme: "theme-roi" }
  ];

  return (
    <section className="page active" style={{ paddingBottom: '4rem' }}>
      
      <div className="page-header">
        <div className="bg-text">WEALTH</div>
        <h1>Boutique Tenkai</h1>
        <p>Achetez vos Coins et devenez une légende du serveur.</p>
      </div>

      {/* SECTION COINS */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '2rem', borderBottom: '1px solid rgba(0, 229, 255, 0.2)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaGem color="#00E5FF" /> Tenkai Coins
        </h2>
        <div className="bento-grid">
          {coins.map((coin, index) => (
            <div key={index} className={`card-wrapper theme-roi ${coin.isBest ? 'bundle-best' : ''}`}>
              <div className="store-card">
                <img src={`/${coin.img}`} className="card-image" alt={coin.name} onError={(e) => e.target.src='https://via.placeholder.com/350x400/111/FFF?text=COINS'} />
                <div className="card-content">
                  <h2 style={{ fontSize: '1.3rem' }}>{coin.name}</h2>
                  <div className="card-footer">
                    <div className="price-badge">{coin.price.toFixed(2)} €</div>
                    <button className="btn-action" onClick={() => addToCart({ ...coin })}>Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION GRADES */}
      <div>
        <h2 style={{ fontSize: '2rem', borderBottom: '1px solid rgba(255, 204, 0, 0.2)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCrown color="#ffcc00" /> Grades VIP
        </h2>
        <div className="bento-grid">
          {grades.map((grade, index) => (
            <div key={index} className={`card-wrapper ${grade.theme}`}>
              <div className="store-card">
                <img src={`/${grade.img}`} className="card-image" alt={grade.name} onError={(e) => e.target.src='https://via.placeholder.com/350x400/222/FFF?text=GRADE'} />
                <div className="card-content">
                  <h2 style={{ fontSize: '1.5rem' }}>{grade.name}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{grade.desc}</p>
                  <div className="card-footer" style={{ marginTop: '1rem' }}>
                    <div className="price-badge">{grade.price.toFixed(2)} €</div>
                    <button className="btn-action" onClick={() => addToCart({ ...grade })}>Devenir VIP</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MUR DES LÉGENDES (Déplacé ici depuis le Footer) 
      ======================================================== */}
      <div className="community-section" style={{ marginTop: '8rem' }}>
        <div className="section-title-wrapper">
          <div className="line"></div>
          <h2>Mur des Légendes</h2>
          <div className="line"></div>
        </div>

        <div className="community-bento">
          {/* Cartes MVP */}
          <div className="mvp-card gold">
            <div className="mvp-avatar-wrapper">
              <div className="mvp-halo"></div>
              <img src="https://i.pravatar.cc/150?img=11" alt="MVP" className="mvp-avatar" />
            </div>
            <div className="mvp-role">Sponsor Légendaire</div>
            <div className="mvp-name">Gol D. Roger</div>
            <div className="mvp-amount">Contribution Maximale</div>
          </div>

          <div className="mvp-card cyan">
             <div className="mvp-avatar-wrapper">
              <div className="mvp-halo"></div>
              <img src="https://i.pravatar.cc/150?img=33" alt="Hero" className="mvp-avatar" />
            </div>
            <div className="mvp-role">Héros du Mois</div>
            <div className="mvp-name">Shanks Le Roux</div>
            <div className="mvp-amount">Empereur de Février</div>
          </div>

          {/* Flux en direct */}
          <div className="live-feed-card">
            <div className="feed-header">
              <h3><span className="live-indicator"></span> Achats en direct</h3>
            </div>
            <div className="feed-list">
              <div className="feed-item">
                <img src="https://i.pravatar.cc/50?img=59" className="feed-avatar" alt="User" />
                <div className="feed-info"><strong>Zoro_77</strong> a acheté <span className="product">Grade Corsaire</span></div>
              </div>
              <div className="feed-item">
                <img src="https://i.pravatar.cc/50?img=44" className="feed-avatar" alt="User" />
                <div className="feed-info"><strong>NamiSwann</strong> a acheté <span className="product">5x Reroll Dial</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}