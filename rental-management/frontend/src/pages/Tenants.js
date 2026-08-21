import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Users, Edit2, Trash2 } from 'lucide-react';

function Modal({ title, onClose, onSubmit, loading, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-secondary btn-sm btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading?'Saving...':'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', password:'' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    usersAPI.getTenants()
      .then(r => setTenants(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const set = f => e => setForm(prev => ({...prev, [f]: e.target.value}));

  const openEdit = (t) => {
    setEditId(t.id);
    setForm({ fullName: t.fullName, email: t.email, phone: t.phone || '', password: '' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await usersAPI.update(editId, form);
      setTenants(prev => prev.map(t => t.id === editId ? res.data : t));
      toast.success('Tenant updated!');
      setModal(false);
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tenant?')) return;
    try {
      await usersAPI.delete(id);
      setTenants(prev => prev.filter(t => t.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = tenants.filter(t =>
    t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Tenants <span style={{fontSize:14,fontWeight:400,color:'var(--text-light)'}}>({tenants.length})</span></h1>
        <div className="filters">
          <input className="search-bar" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:16 }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{gridColumn:'1/-1'}}><Users size={40}/><p>No tenants found</p></div>
        ) : filtered.map(t => (
          <div key={t.id} className="card" style={{ padding: 20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#1e40af,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, fontWeight:700, flexShrink:0 }}>
                {t.fullName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:15 }}>{t.fullName}</div>
                <div style={{ fontSize:12, color:'var(--text-light)' }}><span className="badge badge-info" style={{fontSize:10}}>{t.role}</span></div>
              </div>
            </div>
            <div style={{ fontSize:13, color:'var(--text-light)', display:'flex', flexDirection:'column', gap:6 }}>
              <div>📧 {t.email}</div>
              {t.phone && <div>📱 {t.phone}</div>}
              <div style={{ fontSize:11 }}>Joined: {t.createdAt?.split('T')[0]}</div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={() => openEdit(t)}><Edit2 size={13}/> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title="Edit Tenant" onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
          <div className="form-grid">
            <div className="form-group form-grid-1"><label>Full Name</label><input className="form-control" value={form.fullName} onChange={set('fullName')} required /></div>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email} onChange={set('email')} required /></div>
            <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={set('phone')} /></div>
            <div className="form-group form-grid-1"><label>New Password (leave blank to keep)</label><input className="form-control" type="password" value={form.password} onChange={set('password')} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
