import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Use a hardcoded session user ID for demo purposes
  const USER_ID = 'demo_user_123';

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart/${USER_ID}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch(`/api/cart/${USER_ID}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (response.ok) {
        fetchCart(); // refresh cart
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`/api/cart/${USER_ID}`, { method: 'DELETE' });
      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const formatPrice = (priceObj) => {
    if (!priceObj) return '$0.00';
    return `$${priceObj.units}.${String(priceObj.nanos).slice(0, 2)}`;
  };

  // Helper to find product details for the cart
  const getProductDetails = (id) => {
    return products.find(p => p.id === id) || { name: 'Unknown Product', priceUsd: { units: 0, nanos: 0 } };
  };

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartTotalPrice = cartItems.reduce((acc, item) => {
    const p = getProductDetails(item.productId);
    const price = p.priceUsd ? (p.priceUsd.units + (p.priceUsd.nanos / 1000000000)) : 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">HipsterShop</div>
        <div className="cart-icon" onClick={() => setCartOpen(true)}>
          🛒 Cart <span className="cart-badge">{cartTotalItems}</span>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="products-grid">
            {products.map((p, idx) => (
              <div 
                key={p.id} 
                className="product-card animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="product-image-container">
                  <img src={p.picture || '/placeholder.png'} alt={p.name} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-desc">{p.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(p.priceUsd)}</span>
                    <button className="add-btn" onClick={() => addToCart(p.id)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="cart-modal-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-btn" onClick={() => setCartOpen(false)}>×</button>
            </div>
            
            {cartItems.length === 0 ? (
              <div style={{color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem'}}>
                Your cart is empty.
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map((item, idx) => {
                  const p = getProductDetails(item.productId);
                  return (
                    <div key={idx} className="cart-item">
                      <div>
                        <strong>{p.name}</strong>
                        <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                          Qty: {item.quantity} x {formatPrice(p.priceUsd)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {cartItems.length > 0 && (
              <div style={{marginTop: 'auto'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold'}}>
                  <span>Total:</span>
                  <span style={{color: 'var(--accent-color)'}}>${cartTotalPrice.toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={clearCart}>
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
