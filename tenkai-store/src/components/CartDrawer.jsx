import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  // Le panier se sert tout seul dans le cerveau !
  const { isCartOpen, setIsCartOpen, cart, cartTotal, removeFromCart, checkout } = useStore();

  return (
    <>
      {isCartOpen && <div className="drawer-overlay active" onClick={() => setIsCartOpen(false)}></div>}
      
      <div className={`drawer ${isCartOpen ? 'active' : ''}`} id="cart-drawer">
        <div className="drawer-header">
          <h2>Mon Panier</h2>
          <button className="close-drawer" onClick={() => setIsCartOpen(false)}>✖</button>
        </div>
        
        <div className="drawer-body">
          {cart.length === 0 ? (
            <p className="empty-msg">Ton panier est vide.</p>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src="https://via.placeholder.com/50/083344/00E5FF?text=🛒" alt="Item" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name || item.title}</div>
                  <div className="cart-item-price">{item.price.toFixed(2)} €</div>
                </div>
                <div className="cart-item-remove" onClick={() => removeFromCart(index)}>Retirer</div>
              </div>
            ))
          )}
        </div>
        
        <div className="drawer-footer">
          <div className="total-line">
            <span>Total :</span>
            <span style={{ color: 'var(--cyan-neon)' }}>{cartTotal.toFixed(2)} €</span>
          </div>
          <button 
            className="btn-checkout" 
            onClick={checkout}
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            Passer au paiement
          </button>
        </div>
      </div>
    </>
  );
}