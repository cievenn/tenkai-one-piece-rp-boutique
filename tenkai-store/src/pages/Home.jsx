import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="page active">
      <div className="page-header">
        <div className="bg-text">GRAND LINE</div>
        <h1>Boutique Officielle</h1>
        <p>La puissance s'achète, le respect se gagne. Choisis ton destin.</p>
      </div>
      
      <div className="bento-grid">
        <div className="card-wrapper theme-cat-reroll" onClick={() => navigate('/rerolls')}>
          <div className="store-card">
            <img src="/dé_reroll.webp" className="card-image" alt="Rerolls" onError={(e) => e.target.src='https://via.placeholder.com/350x400/ff4757/FFF?text=DÉ'} />
            <div className="card-content">
              <h2>Rerolls</h2>
              <p>Défie le hasard.</p>
              <div className="card-footer"><button className="btn-action">Découvrir</button></div>
            </div>
          </div>
        </div>
        
        <div className="card-wrapper theme-cat-reset" onClick={() => navigate('/resets')}>
          <div className="store-card">
            <img src="/reset.webp" className="card-image" alt="Resets" onError={(e) => e.target.src='https://via.placeholder.com/350x400/a241f7/FFF?text=RESET'} />
            <div className="card-content">
              <h2>Resets</h2>
              <p>Nouveau fruit, nouvelle vie.</p>
              <div className="card-footer"><button className="btn-action">Découvrir</button></div>
            </div>
          </div>
        </div>

        <div className="card-wrapper theme-cat-vip title-accent" onClick={() => navigate('/grades')}>
          <div className="store-card">
            <img src="/grade.webp" className="card-image" alt="VIP" onError={(e) => e.target.src='https://via.placeholder.com/350x400/ffcc00/000?text=GRADE'} />
            <div className="card-content">
              <h2>VIP</h2>
              <p>Deviens une légende.</p>
              <div className="card-footer"><button className="btn-action">Découvrir</button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}