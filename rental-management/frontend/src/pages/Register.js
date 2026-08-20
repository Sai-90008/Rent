import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Home } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '', phone: '', role: 'TENANT' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setForm({...form, [field]: e.target.value});

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:8 }}>
            <div style={{ background:'#1e40af', borderRadius:10, padding:8, display:'flex' }}>
              <Home size={24} color="#fff" />
            </div>
          </div>
          <h1>Create Account</h1>
          <p>Join RentPro Management System</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" placeholder="John Doe" value={form.fullName} onChange={set('fullName')} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input className="form-control" placeholder="johndoe" value={form.username} onChange={set('username')} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select className="form-control" value={form.role} onChange={set('role')}>
                <option value="TENANT">Tenant</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <button className="auth-submit" type="submit" disabled={loading} style={{ marginTop:16 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
