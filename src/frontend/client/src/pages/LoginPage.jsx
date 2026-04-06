import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLogin({ email: data.email || email, token: data.token, userId: data.userId || data._id });
        navigate('/');
      } else {
        setError(data.message || data.error || 'Invalid email or password.');
      }
    } catch (_) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="container py-5" style={{ maxWidth: '480px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title mb-4 text-center" style={{ fontWeight: 700 }}>Log In</h2>

          {error && <div className="alert alert-danger small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-dark btn-block w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <hr />
          <p className="text-center small">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
