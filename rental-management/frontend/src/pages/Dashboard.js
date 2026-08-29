import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { Building2, Users, FileText, CreditCard, Wrench, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: bg }}>
      <Icon size={24} color={color} />
    </div>
    <div className="stat-info">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const statusBadge = (status) => {
  const map = { COMPLETED:'success', PENDING:'warning', OVERDUE:'danger', CANCELLED:'secondary',
    OPEN:'warning', IN_PROGRESS:'info', RESOLVED:'success' };
  return <span className={`badge badge-${map[status]||'secondary'}`}>{status}</span>;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><p>Could not load dashboard</p></div>;

  const chartData = [
    { name: 'Properties', total: data.totalProperties, available: data.availableProperties, occupied: data.occupiedProperties },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Overview</h1>
        <span style={{ color: 'var(--text-light)', fontSize: 13 }}>Real-time system summary</span>
      </div>

      <div className="stats-grid">
        <StatCard icon={Building2} label="Total Properties" value={data.totalProperties} color="#1e40af" bg="#dbeafe" />
        <StatCard icon={Building2} label="Available" value={data.availableProperties} color="#16a34a" bg="#dcfce7" />
        <StatCard icon={Building2} label="Occupied" value={data.occupiedProperties} color="#7c3aed" bg="#ede9fe" />
        <StatCard icon={FileText} label="Active Leases" value={data.activeLeases} color="#0891b2" bg="#cffafe" />
        <StatCard icon={Users} label="Total Tenants" value={data.totalTenants} color="#d97706" bg="#fef3c7" />
        <StatCard icon={AlertTriangle} label="Overdue Payments" value={data.overduePayments} color="#dc2626" bg="#fee2e2" />
        <StatCard icon={Wrench} label="Open Maintenance" value={data.openMaintenanceRequests} color="#ea580c" bg="#ffedd5" />
        <StatCard icon={TrendingUp} label="Total Revenue" value={`Rs.${(data.totalRevenue||0).toLocaleString()}`} color="#16a34a" bg="#dcfce7" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Payments</h3>
            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Last transactions</span>
          </div>
          <div className="table-wrap">
            {data.recentPayments?.length === 0 ? (
              <div className="empty-state"><p>No recent payments</p></div>
            ) : (
              <table>
                <thead><tr><th>Tenant</th><th>Property</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {(data.recentPayments || []).map(p => (
                    <tr key={p.id}>
                      <td>{p.tenantName}</td>
                      <td>{p.propertyName}</td>
                      <td><strong>Rs.{p.amount?.toLocaleString()}</strong></td>
                      <td>{statusBadge(p.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Open Maintenance</h3></div>
          <div style={{ padding: '8px 0' }}>
            {(data.recentMaintenance || []).length === 0 ? (
              <div className="empty-state"><Wrench size={32}/><p>No open requests</p></div>
            ) : (data.recentMaintenance || []).map(m => (
              <div key={m.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <strong style={{ fontSize: 13 }}>{m.title}</strong>
                  <span className={`badge badge-${m.priority==='URGENT'?'danger':m.priority==='HIGH'?'warning':'info'}`} style={{ fontSize:10 }}>{m.priority}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--text-light)' }}>{m.propertyName} · {m.tenantName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><h3>Monthly Revenue</h3></div>
        <div className="card-body">
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>${(data.monthlyRevenue||0).toLocaleString()}</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>Revenue this month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
