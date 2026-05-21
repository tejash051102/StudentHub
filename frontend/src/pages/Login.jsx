import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate('/');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to sign in');
    }
  }

  return (
    <section className="auth-screen">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Student Records</span>
          <h1>Sign in</h1>
        </div>
        {error && <p className="alert">{error}</p>}
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
            required
          />
        </label>
        <button type="submit">Login</button>
        <p>
          New administrator? <Link to="/register">Create account</Link>
        </p>
      </form>
    </section>
  );
}
