import { Link, useLocation } from 'react-router-dom';
import { FaSteam, FaShoppingCart, FaHistory, FaHome, FaServer, FaStore } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
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
      
      {/* LES 3 PILIERS DU SITE */}
      <div className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/')}`}><FaHome /> Accueil</Link>
        <Link to="/panel" className={`nav-item ${isActive('/panel')}`}><FaServer /> Panel Joueur</Link>
        <Link to="/boutique" className={`nav-item ${isActive('/boutique')}`}><FaStore /> Boutique</Link>
      </div>
      
      <div className="user-actions">
        {!isLoggedIn ? (
          <button className="btn-steam" onClick={login}>
            <FaSteam size={18} /> <span>Connexion</span>
          </button>
        ) : (
          <div className="user-profile active">
            <div className="user-info">
              <img src={user?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Avatar" />
              <div className="user-text">
                <span className="user-name">{user?.username || user?.name || "Pirate"}</span>
                <span style={{fontSize: '0.7rem', color: '#00E5FF', fontWeight: 'bold'}}>Connecté</span>
              </div>
            </div>
            <div className="user-buttons">
              <button className="action-icon" onClick={() => setIsCartOpen(true)}>
                <FaShoppingCart size={18} />
                {cart.length > 0 && <span className="cart-badge active">{cart.length}</span>}
              </button>
              <button className="action-icon" onClick={() => setIsHistoryOpen(true)}>
                <FaHistory size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}