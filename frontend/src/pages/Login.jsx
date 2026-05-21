import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <motion.form
        className="auth-panel"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: -28, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div>
          <img className="auth-logo" src="/assets/studenthub-logo.png" alt="StudentHub logo" />
          <span className="eyebrow">StudentHub</span>
          <h1>Welcome back</h1>
          <p>Sign in to manage students, courses, departments, and analytics.</p>
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
          New to StudentHub? <Link to="/register">Create account</Link>
        </p>
      </motion.form>
      <motion.aside
        className="auth-showcase"
        initial={{ opacity: 0, x: 28, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
      >
        <img className="showcase-logo" src="/assets/studenthub-logo.png" alt="StudentHub logo" />
        <span className="eyebrow">Campus SaaS Dashboard</span>
        <h2>Student information, attendance, and academics in one place.</h2>
        <div className="mini-chart">
          <i style={{ height: '55%' }} />
          <i style={{ height: '72%' }} />
          <i style={{ height: '48%' }} />
          <i style={{ height: '88%' }} />
          <i style={{ height: '64%' }} />
        </div>
      </motion.aside>
    </section>
  );
}
