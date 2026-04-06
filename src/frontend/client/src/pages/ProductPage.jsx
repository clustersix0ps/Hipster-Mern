import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Strip /static prefix since images are served at /img/products/ not /static/img/products/
function imgSrc(picture) {
  if (!picture) return '/img/products/mug.jpg';
  return picture.replace(/^\/static/, '');
}

function formatMoney(priceObj, currency) {
  if (!priceObj) return '$0.00';
  const amount = priceObj.units + (priceObj.nanos / 1e9);
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch (_) {
    return `$${amount.toFixed(2)}`;
  }
}

function ProductPage({ currency, user, onCartChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setProduct(data?.product || data))
      .catch(() => {});

    fetch(`/api/recommendations?productIds=${id}`)
      .then(r => r.ok ? r.json() : { productIds: [] })
      .then(async data => {
        const ids = (data.productIds || []).slice(0, 4);
        const products = await Promise.all(
          ids.map(pid =>
            fetch(`/api/products/${pid}`)
              .then(r => r.ok ? r.json() : null)
              .then(d => d?.product || d)
              .catch(() => null)
          )
        );
        setRecommendations(products.filter(Boolean));
      })
      .catch(() => {});
  }, [id]);

  const addToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await fetch(`/api/cart/${user.userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ productId: id, quantity: parseInt(quantity) })
      });
      setAdded(true);
      onCartChange && onCartChange();
      setTimeout(() => setAdded(false), 2000);
    } catch (_) {}
    setAdding(false);
  };

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-product container">
        <div className="row">
          <div className="col-md-6">
            <img
              className="product-image"
              alt={product.name}
              src={imgSrc(product.picture)}
              onError={e => { e.target.src = '/img/products/mug.jpg'; }}
            />
          </div>
          <div className="product-info col-md-5">
            <div className="product-wrapper">
              <h2>{product.name}</h2>
              <p className="product-price">{formatMoney(product.priceUsd, currency)}</p>
              <p>{product.description}</p>

              <div className="product-quantity-dropdown">
                <select
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  id="quantity"
                >
                  {[1,2,3,4,5,10].map(n => <option key={n}>{n}</option>)}
                </select>
                <img src="/static/icons/Hipster_DownArrow.svg" alt="" onError={e => e.target.style.display='none'} />
              </div>

              <button
                className="cymbal-button-primary"
                onClick={addToCart}
                disabled={adding}
                style={{ marginTop: '16px' }}
              >
                {added ? '✓ Added!' : adding ? 'Adding...' : 'Add To Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <div className="container">
            <h2>You May Also Like</h2>
            <div className="row">
              {recommendations.map(r => (
                <div key={r.id} className="col-md-3 col-6" style={{ marginBottom: '24px' }}>
                  <a href={`/product/${r.id}`}>
                    <img
                      src={imgSrc(r.picture)}
                      alt={r.name}
                      onError={e => { e.target.src = '/img/products/mug.jpg'; }}
                    />
                    <h5>{r.name}</h5>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductPage;
