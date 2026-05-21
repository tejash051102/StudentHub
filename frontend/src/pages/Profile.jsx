import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', department: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        department: data.department || ''
      });
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const { data } = await api.put('/profile', form);
    updateUser(data);
    setMessage('Profile updated successfully');
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Profile</h1>
        </div>
      </div>

      <form className="panel profile-panel" onSubmit={handleSubmit}>
        {message && <p className="success">{message}</p>}
        <label>
          Name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label>
          Department
          <input
            value={form.department}
            onChange={(event) => setForm({ ...form, department: event.target.value })}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </section>
  );
}
