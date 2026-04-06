import { Link, useNavigate } from 'react-router-dom';

function Header({ user, cartSize, currency, currencies, onLogout, onCurrencyChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header>
      <div className="navbar sub-navbar">
        <div className="container d-flex justify-content-between">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#111111', letterSpacing: '1px' }}>
              Hipster Shop
            </span>
          </Link>

          <div className="controls">
            {/* Currency Selector */}
            <div className="h-controls">
              <div className="h-control">
                <span className="icon currency-icon">$</span>
                <select
                  name="currency_code"
                  value={currency}
                  onChange={e => onCurrencyChange(e.target.value)}
                  style={{ display:'flex', alignItems:'center', background:'transparent', borderRadius:'8px', border:'1px solid #acacac', width:'130px', height:'40px', padding:'1px 0 0 45px', fontSize:'16px' }}
                >
                  {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <img
                  src="/static/icons/Hipster_DownArrow.svg"
                  alt=""
                  className="icon arrow"
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-link">
              <img
                src="/static/icons/Hipster_CartIcon.svg"
                alt="Cart icon"
                className="logo"
                title="Cart"
                style={{ width: '20px', height: '20px', marginBottom: '3px' }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='inline'; }}
              />
              <span style={{ display:'none', fontSize:'20px' }}>🛒</span>
              {cartSize > 0 && <span className="cart-size-circle">{cartSize}</span>}
            </Link>

            {/* Auth */}
            <div className="auth-actions">
              {user ? (
                <>
                  <span className="auth-email">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="btn auth-btn auth-btn-outline"
                    style={{ cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn auth-btn auth-btn-outline">Login</Link>
                  <Link to="/signup" className="btn auth-btn auth-btn-solid">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
