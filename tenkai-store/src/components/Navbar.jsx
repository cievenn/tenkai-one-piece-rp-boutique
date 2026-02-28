import { Link, useLocation } from 'react-router-dom';
import { FaSteam, FaShoppingCart, FaHistory } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  // Plus besoin du "logout"
  const { isLoggedIn, login, user, cart, setIsCartOpen, setIsHistoryOpen } = useStore();
  
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav>
      <div className="logo-nav">
        <Link to="/">
          <img src="/tenkailogo.webp" alt="TENKAI" className="nav-logo-img" onError={(e) => e.target.src='https://via.placeholder.com/150x45/00E5FF/000000?text=TENKAI'} />
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/')}`}>Accueil</Link>
        <Link to="/rerolls" className={`nav-item ${isActive('/rerolls')}`}>Rerolls</Link>
        <Link to="/resets" className={`nav-item ${isActive('/resets')}`}>Resets</Link>
        <Link to="/grades" className={`nav-item ${isActive('/grades')}`}>Grades VIP</Link>
      </div>
      
      <div className="user-actions">
        {!isLoggedIn ? (
          <button className="btn-steam" onClick={login}>
            <FaSteam size={18} /> <span>Se Connecter</span>
          </button>
        ) : (
          <div className="user-profile active">
            <div className="user-info">
              <img src={user?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Avatar" />
              <div className="user-text">
                <span className="user-name">{user?.name || "Pirate_99"}</span>
                {/* On ne peut plus cliquer pour se déconnecter */}
                <span style={{fontSize: '0.7rem', color: '#00E5FF', fontWeight: 'bold'}}>Connecté</span>
              </div>
            </div>
            <div className="user-buttons">
              <button className="action-icon" onClick={() => setIsCartOpen(true)} title="Panier">
                <FaShoppingCart size={18} />
                {cart.length > 0 && <span className="cart-badge active">{cart.length}</span>}
              </button>
              <button className="action-icon" onClick={() => setIsHistoryOpen(true)} title="Historique">
                <FaHistory size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}