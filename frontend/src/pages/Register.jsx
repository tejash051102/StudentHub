import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    phone: ''
  });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await register(form);
      navigate('/');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to create account');
    }
  }

  return (
    <section className="auth-screen">
      <form className="auth-panel wide" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">StudentHub</span>
          <h1>Create institution account</h1>
          <p>Set up an admin workspace for your college or academic department.</p>
        </div>
        {error && <p className="alert">{error}</p>}
        <div className="form-grid">
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength="6"
              required
            />
          </label>
          <label>
            Department
            <input
              value={form.department}
              onChange={(event) => setForm({ ...form, department: event.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </label>
        </div>
        <button type="submit">Register</button>
        <p>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
