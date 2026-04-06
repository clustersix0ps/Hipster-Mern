import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrderPage from './pages/OrderPage';

function App() {
  const [user, setUser] = useState(null);       // { email, token }
  const [cartSize, setCartSize] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'INR'];

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hipster_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  // Fetch cart size whenever user/currency changes
  useEffect(() => {
    refreshCartSize();
  }, [user]);

  const refreshCartSize = async () => {
    if (!user) { setCartSize(0); return; }
    try {
      const res = await fetch(`/api/cart/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const total = (data.items || []).reduce((s, i) => s + i.quantity, 0);
        setCartSize(total);
      }
    } catch (_) {}
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('hipster_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCartSize(0);
    localStorage.removeItem('hipster_user');
  };

  const handleCurrencyChange = (c) => setCurrency(c);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        user={user}
        cartSize={cartSize}
        currency={currency}
        currencies={currencies}
        onLogout={handleLogout}
        onCurrencyChange={handleCurrencyChange}
      />
      <main role="main" style={{ flex: '1 0 auto', backgroundColor: '#F9F9F9' }}>
        <Routes>
          <Route path="/" element={<HomePage currency={currency} user={user} onCartChange={refreshCartSize} />} />
          <Route path="/product/:id" element={<ProductPage currency={currency} user={user} onCartChange={refreshCartSize} />} />
          <Route path="/cart" element={<CartPage currency={currency} user={user} onCartChange={refreshCartSize} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
