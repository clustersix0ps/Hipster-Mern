import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function formatMoney(priceObj, currency) {
  if (!priceObj) return '$0.00';
  const amount = priceObj.units + (priceObj.nanos / 1e9);
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch (_) { return `$${amount.toFixed(2)}`; }
}

function CartPage({ currency, user, onCartChange }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || 'someone@example.com',
    street_address: '1600 Amphitheatre Parkway',
    zip_code: '94043',
    city: 'Mountain View',
    state: 'CA',
    country: 'United States',
    credit_card_number: '4432801561520454',
    credit_card_expiration_month: '1',
    credit_card_expiration_year: String(new Date().getFullYear() + 1),
    credit_card_cvv: '672'
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      const cartItems = data.items || [];
      setItems(cartItems);

      // Fetch product details for each item
      const prodMap = {};
      await Promise.all(cartItems.map(async item => {
        try {
          const pr = await fetch(`/api/products/${item.productId}`);
          if (pr.ok) {
            const pd = await pr.json();
            prodMap[item.productId] = pd.product || pd;
          }
        } catch (_) {}
      }));
      setProducts(prodMap);
    } catch (_) {}
    setLoading(false);
  };

  const emptyCart = async () => {
    await fetch(`/api/cart/${user.userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setItems([]);
    onCartChange && onCartChange();
  };

  const calcTotal = () => {
    return items.reduce((sum, item) => {
      const p = products[item.productId];
      if (!p?.priceUsd) return sum;
      return sum + (p.priceUsd.units + p.priceUsd.nanos / 1e9) * item.quantity;
    }, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          userId: user.userId,
          userCurrency: currency,
          address: {
            streetAddress: form.street_address,
            city: form.city,
            state: form.state,
            country: form.country,
            zipCode: form.zip_code
          },
          email: form.email,
          creditCard: {
            creditCardNumber: form.credit_card_number,
            creditCardCvv: parseInt(form.credit_card_cvv),
            creditCardExpirationMonth: parseInt(form.credit_card_expiration_month),
            creditCardExpirationYear: parseInt(form.credit_card_expiration_year)
          }
        })
      });
      if (res.ok) {
        const order = await res.json();
        setItems([]);
        onCartChange && onCartChange();
        navigate(`/order/${order.orderId || order.order_id || 'confirmed'}`);
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (_) {
      alert('Checkout error. Please try again.');
    }
    setCheckoutLoading(false);
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years = Array.from({length: 6}, (_, i) => new Date().getFullYear() + i);

  if (loading) return <div className="container" style={{ textAlign:'center', paddingTop:'80px' }}><div className="spinner-border"></div></div>;

  if (items.length === 0) {
    return (
      <section className="empty-cart-section">
        <h3>Your shopping cart is empty!</h3>
        <p>Items you add to your shopping cart will appear here.</p>
        <Link className="cymbal-button-primary" to="/" role="button">Continue Shopping</Link>
      </section>
    );
  }

  const cartSize = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <section className="container cart-sections">
      <div className="row">
        {/* Cart Summary */}
        <div className="col-lg-6 col-xl-5 offset-xl-1 cart-summary-section">
          <div className="row mb-3 py-2">
            <div className="col-4 pl-md-0"><h3>Cart ({cartSize})</h3></div>
            <div className="col-8 pr-md-0 text-right">
              <button className="cymbal-button-secondary cart-summary-empty-cart-button" onClick={emptyCart} type="button">
                Empty Cart
              </button>
              <Link className="cymbal-button-primary" to="/" role="button" style={{ marginLeft: '10px' }}>
                Continue Shopping
              </Link>
            </div>
          </div>

          {items.map((item, idx) => {
            const p = products[item.productId] || {};
            return (
              <div key={idx} className="row cart-summary-item-row">
                <div className="col-md-4 pl-md-0">
                  <Link to={`/product/${item.productId}`}>
                    <img
                      className="img-fluid"
                      alt={p.name || ''}
                      src={p.picture || `/static/img/products/${item.productId}.jpg`}
                      onError={e => { e.target.src = '/static/img/products/mug.jpg'; }}
                    />
                  </Link>
                </div>
                <div className="col-md-8 pr-md-0">
                  <div className="row"><div className="col"><h4>{p.name}</h4></div></div>
                  <div className="row cart-summary-item-row-item-id-row">
                    <div className="col">SKU #{item.productId}</div>
                  </div>
                  <div className="row">
                    <div className="col">Quantity: {item.quantity}</div>
                    <div className="col pr-md-0 text-right">
                      <strong>{formatMoney(p.priceUsd, currency)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="row cart-summary-shipping-row">
            <div className="col pl-md-0">Shipping</div>
            <div className="col pr-md-0 text-right">Free</div>
          </div>
          <div className="row cart-summary-total-row">
            <div className="col pl-md-0">Total</div>
            <div className="col pr-md-0 text-right">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(calcTotal())}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="col-lg-5 offset-lg-1 col-xl-4">
          <form className="cart-checkout-form" onSubmit={handleCheckout}>
            <div className="row"><div className="col"><h3>Shipping Address</h3></div></div>

            {[
              ['email', 'E-mail Address', 'email'],
              ['street_address', 'Street Address', 'text'],
              ['zip_code', 'Zip Code', 'text'],
              ['city', 'City', 'text'],
            ].map(([name, label, type]) => (
              <div className="form-row" key={name}>
                <div className="col cymbal-form-field">
                  <label htmlFor={name}>{label}</label>
                  <input
                    type={type}
                    id={name}
                    value={form[name]}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    required
                  />
                </div>
              </div>
            ))}

            <div className="form-row">
              <div className="col-md-5 cymbal-form-field">
                <label htmlFor="state">State</label>
                <input id="state" type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} required />
              </div>
              <div className="col-md-7 cymbal-form-field">
                <label htmlFor="country">Country</label>
                <input id="country" type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} required />
              </div>
            </div>

            <div className="row"><div className="col"><h3 className="payment-method-heading">Payment Method</h3></div></div>

            <div className="form-row">
              <div className="col cymbal-form-field">
                <label htmlFor="credit_card_number">Credit Card Number</label>
                <input
                  type="text"
                  id="credit_card_number"
                  value={form.credit_card_number}
                  onChange={e => setForm({...form, credit_card_number: e.target.value})}
                  placeholder="0000000000000000"
                  required
                  pattern="\d{16}"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="col-md-5 cymbal-form-field">
                <label htmlFor="credit_card_expiration_month">Month</label>
                <select
                  id="credit_card_expiration_month"
                  value={form.credit_card_expiration_month}
                  onChange={e => setForm({...form, credit_card_expiration_month: e.target.value})}
                >
                  {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div className="col-md-4 cymbal-form-field">
                <label htmlFor="credit_card_expiration_year">Year</label>
                <select
                  id="credit_card_expiration_year"
                  value={form.credit_card_expiration_year}
                  onChange={e => setForm({...form, credit_card_expiration_year: e.target.value})}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="col-md-3 cymbal-form-field">
                <label htmlFor="credit_card_cvv">CVV</label>
                <input
                  type="password"
                  id="credit_card_cvv"
                  value={form.credit_card_cvv}
                  onChange={e => setForm({...form, credit_card_cvv: e.target.value})}
                  required
                  pattern="\d{3}"
                />
              </div>
            </div>

            <div className="form-row justify-content-center">
              <div className="col text-center">
                <button className="cymbal-button-primary" type="submit" disabled={checkoutLoading}>
                  {checkoutLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CartPage;
