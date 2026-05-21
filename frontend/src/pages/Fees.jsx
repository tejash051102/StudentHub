import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Fees() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    api.get('/erp/fees').then(({ data }) => setFees(data));
  }, []);

  const pending = fees.filter((fee) => fee.status !== 'Paid');

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Payments</span>
          <h1>Fee Management</h1>
          <p>Monitor paid, partial, pending, and overdue fee records.</p>
        </div>
        <button type="button">Add Fee Record</button>
      </div>
      <div className="dashboard-grid">
        <section className="panel"><h2>Payment Status</h2><div className="segment-list"><div className="segment tone-green"><span>Collected</span><strong>{fees.filter((fee) => fee.status === 'Paid').length}</strong></div><div className="segment tone-blue"><span>Pending</span><strong>{pending.length}</strong></div></div></section>
        <section className="panel"><h2>Alerts</h2><div className="activity-list">{pending.slice(0, 4).map((fee) => <div className="activity-item" key={fee._id}><span>FE</span><div><strong>{fee.student?.firstName || 'Student'} fee due</strong><small>{fee.status} - {fee.amount}</small></div></div>)}{!pending.length && <p className="muted">No pending fee alerts.</p>}</div></section>
      </div>
      <section className="panel table-wrap"><table><thead><tr><th>Student</th><th>Category</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Status</th></tr></thead><tbody>{fees.map((fee) => <tr key={fee._id}><td>{fee.student ? `${fee.student.firstName} ${fee.student.lastName}` : 'Student'}</td><td>{fee.category}</td><td>{fee.amount}</td><td>{fee.paidAmount}</td><td>{new Date(fee.dueDate).toLocaleDateString()}</td><td><span className="status-pill">{fee.status}</span></td></tr>)}</tbody></table>{!fees.length && <p className="muted empty-state">No fee records yet.</p>}</section>
    </section>
  );
}
