import { useParams, useNavigate } from 'react-router-dom';
import { storeData } from '../data/store';
import { useStore } from '../context/StoreContext'; // 1. Import

export default function SubCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore(); // 2. On récupère addToCart ici
  
  const data = storeData.products[id];

  if (!data) return <div>Produit introuvable</div>;

  return (
    <section className="page active">
      <div className="page-header">
        <span className="btn-back" onClick={() => navigate(-1)}>« Retour</span>
        <div className="bg-text">{data.bgText}</div>
        <h1>{data.title}</h1>
      </div>
      <div className="bento-grid">
        {data.offers.map((offer, index) => (
          <div key={index} className={`card-wrapper ${data.theme} ${offer.isBest ? 'bundle-best' : ''}`}>
            <div className="store-card">
              <img src={`/${data.img}`} className="card-image" alt={offer.name} onError={(e) => e.target.src='https://via.placeholder.com/350x400/333/FFF?text=IMG'} />
              <div className="card-content">
                <h2>{offer.name}</h2>
                <div className="card-footer">
                  <div className="price-badge">{offer.price.toFixed(2)} €</div>
                  <button className="btn-action" onClick={(e) => {
                    e.stopPropagation();
                    addToCart(offer);
                  }}>Acheter</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}