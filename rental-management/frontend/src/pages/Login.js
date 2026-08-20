import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Home, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ background: '#1e40af', borderRadius: 10, padding: 8, display: 'flex' }}>
              <Home size={24} color="#fff" />
            </div>
          </div>
          <h1>RentPro</h1>
          <p>Rental Management System</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="form-control" placeholder="Enter username"
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input className="form-control" type={showPass ? 'text' : 'password'}
              placeholder="Enter password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 10, top: 32, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
        <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
          <strong>Demo:</strong> Register a new account or use existing credentials.
        </div>
      </div>
    </div>
  );
}
