import { useStore } from '../context/StoreContext';
import { FaGem, FaCrown } from 'react-icons/fa';

export default function Boutique() {
  const { addToCart } = useStore();

  // Les données sont maintenant écrites en dur ici pour plus de fluidité, 
  // tu pourras les modifier facilement.
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

    </section>
  );
}