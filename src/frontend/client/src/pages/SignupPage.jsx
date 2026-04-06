import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLogin({ email: data.email || email, token: data.token, userId: data.userId || data._id });
        navigate('/');
      } else {
        setError(data.message || data.error || 'Registration failed.');
      }
    } catch (_) {
      setError('Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="container py-5" style={{ maxWidth: '480px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title mb-4 text-center" style={{ fontWeight: 700 }}>Create Account</h2>

          {error && <div className="alert alert-danger small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>
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
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-dark btn-block w-100" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <hr />
          <p className="text-center small">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
