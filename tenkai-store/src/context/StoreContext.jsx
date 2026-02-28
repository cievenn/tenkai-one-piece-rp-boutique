import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 1. LA MÉMOIRE : On charge depuis le disque dur du navigateur, ou on met vide
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('tenkai_cart')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('tenkai_history')) || []);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  // 2. LA SAUVEGARDE : À chaque modification, on écrit sur le disque dur
  useEffect(() => { localStorage.setItem('tenkai_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('tenkai_history', JSON.stringify(history)); }, [history]);

  useEffect(() => {
    fetch('http://localhost:3000/auth/session', {credentials: 'include'})
      .then(res => res.json())
      .then(data => { if (data.authenticated) { setIsLoggedIn(true); setUser(data.user); }})
      .catch(err => console.log("Non connecté", err));
  }, []);

  // 3. NOUVELLE FONCTION : Transférer le panier dans l'historique au retour de Stripe
  const processSuccessfulPayment = () => {
    if (cart.length === 0) return;
    const newHistoryItems = cart.map(item => ({ ...item, date: new Date().toLocaleString('fr-FR') }));
    setHistory((prev) => [...newHistoryItems, ...prev]);
    setCart([]); // On vide le panier après le succès !
  };

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
  
  const checkout = async () => { 
    if (cart.length === 0) return;
    
    try {
      // 1. On contacte notre backend en lui envoyant le contenu du panier
      const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      // 2. Si le backend renvoie bien une URL Stripe, on redirige l'utilisateur !
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Erreur lors de la création de la session:", data.error);
        alert("Erreur de paiement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <StoreContext.Provider value={{
      user, isLoggedIn, login, showLoginError, setShowLoginError,
      cart, cartTotal, addToCart, removeFromCart, checkout,
      history, isCartOpen, setIsCartOpen, isHistoryOpen, setIsHistoryOpen, processSuccessfulPayment
    }}>
      {children}
    </StoreContext.Provider>
  );
}