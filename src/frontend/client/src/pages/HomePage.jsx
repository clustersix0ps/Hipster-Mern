import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function formatMoney(priceObj, currency) {
  if (!priceObj) return '$0.00';
  const amount = priceObj.units + (priceObj.nanos / 1e9);
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch (_) {
    return `$${amount.toFixed(2)}`;
  }
}

function HomePage({ currency, user, onCartChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : { products: [] })
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (productId) => {
    if (!user) { window.location.href = '/login'; return; }
    setAddingId(productId);
    try {
      await fetch(`/api/cart/${user.userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      onCartChange && onCartChange();
    } catch (_) {}
    setAddingId(null);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-12 px-10-percent">
            <div className="row hot-products-row px-xl-6">
              <div className="col-12">
                <h3>Hot Products</h3>
              </div>
              {products.map(p => (
                <div key={p.id} className="col-md-4 hot-product-card">
                  <Link to={`/product/${p.id}`}>
                    <img
                      loading="lazy"
                      src={p.picture || `/static/img/products/${p.id}.jpg`}
                      alt={p.name}
                      onError={e => { e.target.src = '/static/img/products/mug.jpg'; }}
                    />
                    <div className="hot-product-card-img-overlay"></div>
                  </Link>
                  <div>
                    <div className="hot-product-card-name">{p.name}</div>
                    <div className="hot-product-card-price">{formatMoney(p.priceUsd, currency)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
