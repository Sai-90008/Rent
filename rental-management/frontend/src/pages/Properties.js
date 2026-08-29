import React, { useState, useEffect } from 'react';
import { propertiesAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

const STATUS_COLORS = { AVAILABLE:'success', OCCUPIED:'info', MAINTENANCE:'warning', INACTIVE:'secondary' };
const TYPE_LABELS = { APARTMENT:'Apartment', HOUSE:'House', STUDIO:'Studio', OFFICE:'Office', COMMERCIAL:'Commercial' };

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
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const initForm = { name:'', address:'', city:'', state:'', zipCode:'', type:'APARTMENT', bedrooms:1, bathrooms:1, squareFeet:'', rentAmount:'', depositAmount:'', status:'AVAILABLE', description:'', amenities:'', ownerId:'' };

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([propertiesAPI.getAll(), usersAPI.getAll()])
      .then(([p, u]) => { setProperties(p.data); setUsers(u.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm(initForm); setModal('add'); };
  const openEdit = (p) => {
    setForm({ ...p, ownerId: p.ownerId || '' });
    setModal('edit');
  };

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') {
        const res = await propertiesAPI.create(form);
        setProperties(prev => [res.data, ...prev]);
        toast.success('Property added!');
      } else {
        const res = await propertiesAPI.update(form.id, form);
        setProperties(prev => prev.map(p => p.id === form.id ? res.data : p));
        toast.success('Property updated!');
      }
      setModal(null);
    } catch { toast.error('Operation failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await propertiesAPI.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted!');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = properties.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Properties <span style={{fontSize:14,fontWeight:400,color:'var(--text-light)'}}>({properties.length})</span></h1>
        <div className="filters">
          <input className="search-bar" placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Property</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state"><Building2 size={40}/><p>No properties found</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Address</th><th>Type</th><th>Beds/Baths</th><th>Rent/mo</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.address}{p.city ? `, ${p.city}` : ''}</td>
                    <td><span className="badge badge-info">{TYPE_LABELS[p.type] || p.type}</span></td>
                    <td>{p.bedrooms}bd / {p.bathrooms}ba</td>
                    <td><strong>Rs.{Number(p.rentAmount).toLocaleString()}</strong></td>
                    <td><span className={`badge badge-${STATUS_COLORS[p.status]||'secondary'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(p)} title="Edit"><Edit2 size={14}/></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Property' : 'Edit Property'} onClose={() => setModal(null)} onSubmit={handleSubmit} loading={saving}>
          <div className="form-grid">
            <div className="form-group form-grid-1"><label>Property Name</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group form-grid-1"><label>Address</label><input className="form-control" value={form.address} onChange={set('address')} required /></div>
            <div className="form-group"><label>City</label><input className="form-control" value={form.city} onChange={set('city')} /></div>
            <div className="form-group"><label>State</label><input className="form-control" value={form.state} onChange={set('state')} /></div>
            <div className="form-group"><label>Zip Code</label><input className="form-control" value={form.zipCode} onChange={set('zipCode')} /></div>
            <div className="form-group"><label>Type</label>
              <select className="form-control" value={form.type} onChange={set('type')}>
                {Object.entries(TYPE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Bedrooms</label><input className="form-control" type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} /></div>
            <div className="form-group"><label>Bathrooms</label><input className="form-control" type="number" min="0" value={form.bathrooms} onChange={set('bathrooms')} /></div>
            <div className="form-group"><label>Rent Amount ($)</label><input className="form-control" type="number" value={form.rentAmount} onChange={set('rentAmount')} required /></div>
            <div className="form-group"><label>Deposit ($)</label><input className="form-control" type="number" value={form.depositAmount} onChange={set('depositAmount')} /></div>
            <div className="form-group"><label>Sq Feet</label><input className="form-control" type="number" value={form.squareFeet} onChange={set('squareFeet')} /></div>
            <div className="form-group"><label>Status</label>
              <select className="form-control" value={form.status} onChange={set('status')}>
                {['AVAILABLE','OCCUPIED','MAINTENANCE','INACTIVE'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Owner</label>
              <select className="form-control" value={form.ownerId} onChange={set('ownerId')}>
                <option value="">-- None --</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Amenities</label><input className="form-control" value={form.amenities} onChange={set('amenities')} placeholder="WiFi, Parking, Pool..." /></div>
            <div className="form-group form-grid-1"><label>Description</label><textarea className="form-control" value={form.description} onChange={set('description')} rows={3} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
