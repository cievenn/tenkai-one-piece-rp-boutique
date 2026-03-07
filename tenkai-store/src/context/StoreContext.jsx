import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext();
export const useStore = () => useContext(StoreContext);

const API_BASE = 'http://localhost:3000';

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('tenkai_cart')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('tenkai_history')) || []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  useEffect(() => { localStorage.setItem('tenkai_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('tenkai_history', JSON.stringify(history)); }, [history]);

  const apiFetch = useCallback(async (endpoint, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const headers = { ...options.headers };
    if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(method)) headers['X-CSRF-Token'] = csrfToken;
    if (options.body && typeof options.body === 'string') headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, method, headers, credentials: 'include' });

    if (res.status === 403) {
      const cloned = res.clone();
      try {
        const data = await cloned.json();
        if (data.error?.includes('CSRF')) {
          const refreshed = await fetch(`${API_BASE}/auth/csrf-token`, { credentials: 'include' });
          if (refreshed.ok) {
            const { csrfToken: newToken } = await refreshed.json();
            setCsrfToken(newToken);
            headers['X-CSRF-Token'] = newToken;
            return fetch(`${API_BASE}${endpoint}`, { ...options, method, headers, credentials: 'include' });
          }
        }
      } catch {}
      return res;
    }
    return res;
  }, [csrfToken]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/session`, { credentials: 'include' });
      const data = await res.json();
      if (data.authenticated) {
        setIsLoggedIn(true);
        setUser(data.user);
        setCsrfToken(data.csrfToken);
      } else {
        setIsLoggedIn(false); setUser(null); setCsrfToken(null);
      }
    } catch { setIsLoggedIn(false); setUser(null); }
    finally { setAuthLoading(false); }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = () => { window.location.href = `${API_BASE}/auth/discord/login`; };
  const logout = () => { window.location.href = `${API_BASE}/auth/logout`; };
  const linkSteam = () => { window.location.href = `${API_BASE}/auth/steam/link`; };

  const processSuccessfulPayment = () => {
    if (cart.length === 0) return;
    setHistory((prev) => [...cart.map(item => ({ ...item, date: new Date().toLocaleString('fr-FR') })), ...prev]);
    setCart([]);
  };

  const addToCart = (product) => {
    if (!isLoggedIn) { setShowLoginError(true); return; }
    setCart((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => setCart((prev) => prev.filter((_, i) => i !== index));

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const response = await apiFetch('/api/create-checkout-session', { method: 'POST', body: JSON.stringify({ cart }) });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur de paiement. Veuillez réessayer.");
    } catch (error) { console.error("Erreur réseau:", error); }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <StoreContext.Provider value={{
      user, setUser, isLoggedIn, login, logout, linkSteam, authLoading,
      showLoginError, setShowLoginError,
      cart, cartTotal, addToCart, removeFromCart, checkout,
      history, isCartOpen, setIsCartOpen, isHistoryOpen, setIsHistoryOpen,
      processSuccessfulPayment, apiFetch, refreshUser, csrfToken, API_BASE
    }}>
      {children}
    </StoreContext.Provider>
  );
}
