import React, { useState, useEffect } from 'react';
import { paymentsAPI, leasesAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Trash2, CreditCard } from 'lucide-react';

const STATUS_COLORS = { COMPLETED:'success', PENDING:'warning', OVERDUE:'danger', CANCELLED:'secondary', REFUNDED:'info' };

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

const initForm = { leaseId:'', tenantId:'', amount:'', paymentDate:'', dueDate:'', status:'COMPLETED', method:'BANK_TRANSFER', transactionId:'', notes:'', lateFee:'' };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(initForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([paymentsAPI.getAll(), leasesAPI.getAll(), usersAPI.getTenants()])
      .then(([p, l, t]) => { setPayments(p.data); setLeases(l.data); setTenants(t.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const set = f => e => setForm(prev => ({...prev, [f]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await paymentsAPI.create(form);
      setPayments(prev => [res.data, ...prev]);
      toast.success('Payment recorded!');
      setModal(false);
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    try {
      await paymentsAPI.delete(id);
      setPayments(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const filtered = filter === 'ALL' ? payments : payments.filter(p => p.status === filter);
  const totalAmount = filtered.reduce((s, p) => s + (p.amount || 0), 0);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Payments <span style={{fontSize:14,fontWeight:400,color:'var(--text-light)'}}>({payments.length})</span></h1>
        <div className="filters">
          <select className="form-control" style={{width:150}} value={filter} onChange={e => setFilter(e.target.value)}>
            {['ALL','COMPLETED','PENDING','OVERDUE','CANCELLED'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => { setForm(initForm); setModal(true); }}><Plus size={16}/> Record Payment</button>
        </div>
      </div>

      {filter !== 'ALL' && (
        <div className="card" style={{padding:16, marginBottom:20, display:'flex', gap:24}}>
          <div><div style={{fontSize:12,color:'var(--text-light)'}}>Filtered Count</div><div style={{fontSize:20,fontWeight:700}}>{filtered.length}</div></div>
          <div><div style={{fontSize:12,color:'var(--text-light)'}}>Total Amount</div><div style={{fontSize:20,fontWeight:700,color:'var(--success)'}}>${totalAmount.toLocaleString()}</div></div>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state"><CreditCard size={40}/><p>No payments found</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Tenant</th><th>Property</th><th>Amount</th><th>Date</th><th>Due Date</th><th>Method</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.tenantName}</strong></td>
                    <td>{p.propertyName}</td>
                    <td><strong style={{color:'var(--success)'}}>+Rs.{Number(p.amount).toLocaleString()}</strong>{p.lateFee && <div style={{fontSize:11,color:'var(--danger)'}}>Late: Rs.{p.lateFee}</div>}</td>
                    <td>{p.paymentDate}</td>
                    <td>{p.dueDate || '—'}</td>
                    <td>{p.method?.replace('_',' ') || '—'}</td>
                    <td><span className={`badge badge-${STATUS_COLORS[p.status]||'secondary'}`}>{p.status}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p.id)}><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <Modal title="Record Payment" onClose={() => setModal(false)} onSubmit={handleSubmit} loading={saving}>
          <div className="form-grid">
            <div className="form-group form-grid-1"><label>Lease *</label>
              <select className="form-control" value={form.leaseId} onChange={set('leaseId')} required>
                <option value="">Select lease...</option>
                {leases.map(l => <option key={l.id} value={l.id}>{l.propertyName} – {l.tenantName}</option>)}
              </select>
            </div>
            <div className="form-group form-grid-1"><label>Tenant *</label>
              <select className="form-control" value={form.tenantId} onChange={set('tenantId')} required>
                <option value="">Select tenant...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Amount ($) *</label><input className="form-control" type="number" value={form.amount} onChange={set('amount')} required /></div>
            <div className="form-group"><label>Late Fee ($)</label><input className="form-control" type="number" value={form.lateFee} onChange={set('lateFee')} /></div>
            <div className="form-group"><label>Payment Date *</label><input className="form-control" type="date" value={form.paymentDate} onChange={set('paymentDate')} required /></div>
            <div className="form-group"><label>Due Date</label><input className="form-control" type="date" value={form.dueDate} onChange={set('dueDate')} /></div>
            <div className="form-group"><label>Status</label>
              <select className="form-control" value={form.status} onChange={set('status')}>
                {['COMPLETED','PENDING','OVERDUE','CANCELLED','REFUNDED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Method</label>
              <select className="form-control" value={form.method} onChange={set('method')}>
                {['CASH','BANK_TRANSFER','CREDIT_CARD','CHECK','ONLINE'].map(s => <option key={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Transaction ID</label><input className="form-control" value={form.transactionId} onChange={set('transactionId')} /></div>
            <div className="form-group"><label>Notes</label><input className="form-control" value={form.notes} onChange={set('notes')} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
