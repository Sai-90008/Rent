import React, { useState, useEffect } from 'react';
import { leasesAPI, propertiesAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit2, XCircle, FileText } from 'lucide-react';

const STATUS_COLORS = { ACTIVE:'success', EXPIRED:'secondary', TERMINATED:'danger', PENDING:'warning' };

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

const initForm = { propertyId:'', tenantId:'', startDate:'', endDate:'', monthlyRent:'', depositPaid:'', status:'ACTIVE', terms:'', paymentDayOfMonth:1 };

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([leasesAPI.getAll(), propertiesAPI.getAll(), usersAPI.getTenants()])
      .then(([l, p, t]) => { setLeases(l.data); setProperties(p.data); setTenants(t.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const set = f => e => setForm(prev => ({...prev, [f]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') {
        const res = await leasesAPI.create(form);
        setLeases(prev => [res.data, ...prev]);
        toast.success('Lease created!');
      } else {
        const res = await leasesAPI.update(form.id, form);
        setLeases(prev => prev.map(l => l.id === form.id ? res.data : l));
        toast.success('Lease updated!');
      }
      setModal(null);
    } catch { toast.error('Operation failed'); }
    finally { setSaving(false); }
  };

  const handleTerminate = async (id) => {
    if (!window.confirm('Terminate this lease?')) return;
    try {
      await leasesAPI.terminate(id);
      setLeases(prev => prev.map(l => l.id === id ? {...l, status:'TERMINATED'} : l));
      toast.success('Lease terminated');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Leases <span style={{fontSize:14,fontWeight:400,color:'var(--text-light)'}}>({leases.length})</span></h1>
        <button className="btn btn-primary" onClick={() => { setForm(initForm); setModal('add'); }}><Plus size={16}/> New Lease</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          {leases.length === 0 ? (
            <div className="empty-state"><FileText size={40}/><p>No leases yet</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Property</th><th>Tenant</th><th>Start</th><th>End</th><th>Rent/mo</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {leases.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.propertyName}</strong><div style={{fontSize:11,color:'var(--text-light)'}}>{l.propertyAddress}</div></td>
                    <td>{l.tenantName}<div style={{fontSize:11,color:'var(--text-light)'}}>{l.tenantEmail}</div></td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td><strong>${Number(l.monthlyRent).toLocaleString()}</strong></td>
                    <td><span className={`badge badge-${STATUS_COLORS[l.status]||'secondary'}`}>{l.status}</span></td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setForm({...l}); setModal('edit'); }} title="Edit"><Edit2 size={14}/></button>
                        {l.status === 'ACTIVE' && (
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleTerminate(l.id)} title="Terminate"><XCircle size={14}/></button>
                        )}
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
        <Modal title={modal==='add'?'New Lease':'Edit Lease'} onClose={() => setModal(null)} onSubmit={handleSubmit} loading={saving}>
          <div className="form-grid">
            <div className="form-group form-grid-1"><label>Property *</label>
              <select className="form-control" value={form.propertyId} onChange={set('propertyId')} required>
                <option value="">Select property...</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name} – {p.address}</option>)}
              </select>
            </div>
            <div className="form-group form-grid-1"><label>Tenant *</label>
              <select className="form-control" value={form.tenantId} onChange={set('tenantId')} required>
                <option value="">Select tenant...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>)}
              </select>
            </div>
            <div className="form-group"><label>Start Date *</label><input className="form-control" type="date" value={form.startDate} onChange={set('startDate')} required /></div>
            <div className="form-group"><label>End Date *</label><input className="form-control" type="date" value={form.endDate} onChange={set('endDate')} required /></div>
            <div className="form-group"><label>Monthly Rent ($) *</label><input className="form-control" type="number" value={form.monthlyRent} onChange={set('monthlyRent')} required /></div>
            <div className="form-group"><label>Deposit Paid ($)</label><input className="form-control" type="number" value={form.depositPaid} onChange={set('depositPaid')} /></div>
            <div className="form-group"><label>Payment Day of Month</label><input className="form-control" type="number" min="1" max="31" value={form.paymentDayOfMonth} onChange={set('paymentDayOfMonth')} /></div>
            <div className="form-group"><label>Status</label>
              <select className="form-control" value={form.status} onChange={set('status')}>
                {['ACTIVE','PENDING','EXPIRED','TERMINATED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group form-grid-1"><label>Terms & Conditions</label><textarea className="form-control" rows={4} value={form.terms} onChange={set('terms')} placeholder="Lease terms and conditions..." /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
