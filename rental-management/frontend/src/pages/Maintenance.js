import React, { useState, useEffect } from 'react';
import { maintenanceAPI, propertiesAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';

const STATUS_COLORS = { OPEN:'warning', IN_PROGRESS:'info', RESOLVED:'success', CLOSED:'secondary', CANCELLED:'secondary' };
const PRIORITY_COLORS = { LOW:'secondary', MEDIUM:'info', HIGH:'warning', URGENT:'danger' };

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

const initForm = { propertyId:'', tenantId:'', assignedToId:'', title:'', description:'', priority:'MEDIUM', status:'OPEN', resolutionNotes:'' };

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([maintenanceAPI.getAll(), propertiesAPI.getAll(), usersAPI.getTenants(), usersAPI.getAll()])
      .then(([m, p, t, u]) => { setRequests(m.data); setProperties(p.data); setTenants(t.data); setUsers(u.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const set = f => e => setForm(prev => ({...prev, [f]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') {
        const res = await maintenanceAPI.create(form);
        setRequests(prev => [res.data, ...prev]);
        toast.success('Request created!');
      } else {
        const res = await maintenanceAPI.update(form.id, form);
        setRequests(prev => prev.map(r => r.id === form.id ? res.data : r));
        toast.success('Updated!');
      }
      setModal(null);
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await maintenanceAPI.delete(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const filtered = statusFilter === 'ALL' ? requests : requests.filter(r => r.status === statusFilter);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Maintenance <span style={{fontSize:14,fontWeight:400,color:'var(--text-light)'}}>({requests.length})</span></h1>
        <div className="filters">
          <select className="form-control" style={{width:160}} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {['ALL','OPEN','IN_PROGRESS','RESOLVED','CLOSED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => { setForm(initForm); setModal('add'); }}><Plus size={16}/> New Request</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state"><Wrench size={40}/><p>No maintenance requests</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Title</th><th>Property</th><th>Tenant</th><th>Priority</th><th>Status</th><th>Assigned To</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.title}</strong>
                      <div style={{fontSize:11,color:'var(--text-light)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description}</div>
                    </td>
                    <td>{r.propertyName}</td>
                    <td>{r.tenantName}</td>
                    <td><span className={`badge badge-${PRIORITY_COLORS[r.priority]||'secondary'}`}>{r.priority}</span></td>
                    <td><span className={`badge badge-${STATUS_COLORS[r.status]||'secondary'}`}>{r.status?.replace('_',' ')}</span></td>
                    <td>{r.assignedToName || <span style={{color:'var(--text-light)'}}>Unassigned</span>}</td>
                    <td style={{fontSize:11,color:'var(--text-light)'}}>{r.createdAt?.split('T')[0]}</td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setForm({...r, assignedToId: r.assignedToId||''}); setModal('edit'); }}><Edit2 size={14}/></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(r.id)}><Trash2 size={14}/></button>
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
        <Modal title={modal==='add'?'New Maintenance Request':'Update Request'} onClose={() => setModal(null)} onSubmit={handleSubmit} loading={saving}>
          <div className="form-grid">
            <div className="form-group form-grid-1"><label>Title *</label><input className="form-control" value={form.title} onChange={set('title')} required /></div>
            <div className="form-group form-grid-1"><label>Property *</label>
              <select className="form-control" value={form.propertyId} onChange={set('propertyId')} required>
                <option value="">Select property...</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Tenant *</label>
              <select className="form-control" value={form.tenantId} onChange={set('tenantId')} required>
                <option value="">Select tenant...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Assign To</label>
              <select className="form-control" value={form.assignedToId} onChange={set('assignedToId')}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Priority</label>
              <select className="form-control" value={form.priority} onChange={set('priority')}>
                {['LOW','MEDIUM','HIGH','URGENT'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Status</label>
              <select className="form-control" value={form.status} onChange={set('status')}>
                {['OPEN','IN_PROGRESS','RESOLVED','CLOSED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group form-grid-1"><label>Description *</label><textarea className="form-control" rows={3} value={form.description} onChange={set('description')} required /></div>
            <div className="form-group form-grid-1"><label>Resolution Notes</label><textarea className="form-control" rows={3} value={form.resolutionNotes} onChange={set('resolutionNotes')} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
