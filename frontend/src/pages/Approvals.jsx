import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Approvals() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  async function loadPendingUsers() {
    const { data } = await api.get('/users/pending');
    setUsers(data);
  }

  async function updateApproval(id, status) {
    await api.patch(`/users/${id}/approval`, { status });
    setMessage(`Registration ${status}`);
    loadPendingUsers();
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Admin Approval</span>
          <h1>Registration Approvals</h1>
          <p>Approve or reject student accounts before they can access StudentHub.</p>
        </div>
      </div>
      {message && <p className="success">{message}</p>}
      <section className="panel table-wrap">
        <table>
          <thead>
            <tr><th>Student</th><th>Enrollment</th><th>Department</th><th>Course</th><th>Contact</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td><strong>{user.name}</strong><small>{user.email}</small></td>
                <td>{user.enrollmentNumber}</td>
                <td>{user.department || '-'}</td>
                <td>{user.course || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <button type="button" className="small-button" onClick={() => updateApproval(user._id, 'approved')}>Approve</button>
                  <button type="button" className="small-button danger" onClick={() => updateApproval(user._id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <p className="muted empty-state">No pending registrations. The admission desk is clear.</p>}
      </section>
    </section>
  );
}
