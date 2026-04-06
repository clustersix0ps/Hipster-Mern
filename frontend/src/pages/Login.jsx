import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Layout>
      <div className="container d-flex justify-content-center" style={{ marginTop: '50px', marginBottom: '100px' }}>
        <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px', border: 'none', borderRadius: '8px' }}>
          <h3 className="text-center mb-4" style={{ fontWeight: 700 }}>Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn auth-btn-solid w-100 mt-3">Log In</button>
          </form>
          <div className="text-center mt-3">
            <small>Don't have an account? <Link to="/signup">Sign up</Link></small>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
