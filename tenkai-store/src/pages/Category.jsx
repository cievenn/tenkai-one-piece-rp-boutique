import { useNavigate } from 'react-router-dom';

export default function Category({ title, subtitle, bgText, items }) {
  const navigate = useNavigate();

  return (
    <section className="page active">
      <div className="page-header">
        <div className="bg-text">{bgText}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="bento-grid">
        {items.map((item) => (
          <div key={item.id} className={`card-wrapper ${item.theme}`} onClick={() => navigate(`/product/${item.id}`)}>
            <div className="store-card">
              {/* Le petit bout de magie pour les images "Reset" */}
              <img 
                src={item.img} 
                className={`card-image ${item.specialImg ? 'img-reset-special' : ''}`} 
                alt={item.title} 
              />
              <div className="card-content">
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
                <div className="card-footer">
                  <button className="btn-action">Voir les offres</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}