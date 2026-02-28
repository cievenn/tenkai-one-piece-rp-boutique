import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/auth/session', {credentials: 'include'})
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsLoggedIn(true);
          setUser(data.user);
        }
      })
      .catch(err => console.log("Non connecté", err));
  }, []);

  const login = () => {
    window.location.href = 'http://localhost:3000/auth/steam';
  };

  const addToCart = (product) => {
      if (!isLoggedIn) { setShowLoginError(true); return; }
      setCart((prev) => [...prev, product]);
      // Plus de notification, on ouvre juste le panier
      setIsCartOpen(true);
  };
    
  const removeFromCart = (index) => setCart((prev) => prev.filter((_, i) => i !== index));
  
  const checkout = () => { 
    if (cart.length === 0) return;
            
    // On garde la logique de l'historique
    const newHistoryItems = cart.map(item => ({ 
        ...item, 
        date: new Date().toLocaleString('fr-FR') 
    }));
    setHistory((prev) => [...newHistoryItems, ...prev]);
    
    // On vide et on ferme le panier silencieusement
    setCart([]); 
    setIsCartOpen(false); 
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <StoreContext.Provider value={{
      user, isLoggedIn, login, showLoginError, setShowLoginError,
      cart, cartTotal, addToCart, removeFromCart, checkout,
      history, isCartOpen, setIsCartOpen, isHistoryOpen, setIsHistoryOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
}