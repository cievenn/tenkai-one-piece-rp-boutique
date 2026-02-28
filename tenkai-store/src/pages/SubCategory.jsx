import { useParams, useNavigate } from 'react-router-dom';
import { storeData } from '../data/store';
import { useStore } from '../context/StoreContext';

export default function SubCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  
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
        {data.offers.map((offer, index) => {
          
          // LA MAGIE EST ICI : On force la lecture de l'image spécifique de l'offre.
          // S'il n'y en a pas, on prend l'image par défaut de la catégorie (ex: le dé)
          const imageToDisplay = offer.img ? `/${offer.img}` : `/${data.img}`;

          return (
            <div key={index} className={`card-wrapper ${data.theme} ${offer.isBest ? 'bundle-best' : ''}`}>
              <div className="store-card">
                
                {/* L'image de la carte utilise notre variable intelligente */}
                <img 
                  src={imageToDisplay} 
                  className="card-image" 
                  alt={offer.name} 
                  onError={(e) => e.target.src='https://via.placeholder.com/350x400/333/FFF?text=IMG'} 
                />
                
                <div className="card-content">
                  <h2>{offer.name}</h2>
                  <div className="card-footer">
                    <div className="price-badge">{offer.price.toFixed(2)} €</div>
                    <button className="btn-action" onClick={(e) => {
                      e.stopPropagation();
                      // On envoie aussi la bonne image au panier !
                      addToCart({ ...offer, img: offer.img || data.img }); 
                    }}>Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}