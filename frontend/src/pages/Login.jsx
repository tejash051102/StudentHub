import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

/* ─── Animated Orb Background ─── */
function OrbField() {
  return (
    <div className="orb-field" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`orb orb-${i}`}
          animate={{
            x: [0, 40 * (i % 2 === 0 ? 1 : -1), -20 * (i % 3 === 0 ? 1 : -1), 0],
            y: [0, -30 * (i % 2 === 0 ? 1 : -1), 40 * (i % 3 === 0 ? 1 : -1), 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Floating Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

/* ─── Stat Counter with animated number ─── */
function AnimatedStat({ label, value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (end === 0) return;
    let start = 0;
    const step = end / 30;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-cell">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{display}{suffix}</strong>
    </div>
  );
}

/* ─── Main Login Component ─── */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [summary, setSummary] = useState({
    database: 'connecting',
    students: 0,
    courses: 0,
    attendance: 0,
    pendingFees: 0,
    pendingApprovals: 0,
    updatedAt: new Date().toISOString(),
  });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const panelRotateX = useTransform(mouseY, [0, 1], [3, -3]);
  const panelRotateY = useTransform(mouseX, [0, 1], [-4, 4]);

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadSummary() {
      try {
        const { data } = await api.get('/public/summary');
        if (mounted) setSummary(data);
      } catch {
        if (mounted) setSummary((c) => ({ ...c, database: 'offline', updatedAt: new Date().toISOString() }));
      }
    }
    loadSummary();
    const interval = setInterval(loadSummary, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  const isOnline = summary.database === 'connected';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #07060f;
          --surface: rgba(18, 16, 32, 0.75);
          --surface2: rgba(255,255,255,0.04);
          --border: rgba(139, 92, 246, 0.18);
          --border-hover: rgba(139, 92, 246, 0.45);
          --accent: #8b5cf6;
          --accent2: #06b6d4;
          --accent3: #f472b6;
          --text: #f1f0f9;
          --muted: rgba(241,240,249,0.45);
          --error: #f87171;
          --radius: 20px;
          --radius-sm: 12px;
        }

        body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }

        .auth-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 860px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-showcase { display: none; }
        }

        /* ── Background ── */
        .particle-canvas {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
        }
        .bg-gradient {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 60% at 20% 40%, rgba(139,92,246,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 50% at 80% 70%, rgba(6,182,212,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 50% 10%, rgba(244,114,182,0.07) 0%, transparent 60%);
        }
        .orb-field { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25;
        }
        .orb-0 { width: 500px; height: 500px; background: #8b5cf6; top: -100px; left: -100px; }
        .orb-1 { width: 350px; height: 350px; background: #06b6d4; top: 30%; right: -80px; }
        .orb-2 { width: 280px; height: 280px; background: #f472b6; bottom: -60px; left: 30%; }
        .orb-3 { width: 200px; height: 200px; background: #8b5cf6; bottom: 20%; right: 25%; opacity: 0.15; }
        .orb-4 { width: 400px; height: 400px; background: #06b6d4; top: 50%; left: 45%; opacity: 0.08; }
        .orb-5 { width: 150px; height: 150px; background: #f472b6; top: 15%; left: 55%; opacity: 0.2; }

        /* Grid lines overlay */
        .grid-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── Form side ── */
        .auth-form-side {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
        }

        .glass-panel {
          width: 100%; max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 44px 40px;
          backdrop-filter: blur(32px) saturate(1.4);
          -webkit-backdrop-filter: blur(32px) saturate(1.4);
          box-shadow:
            0 0 0 1px rgba(139,92,246,0.08),
            0 32px 80px rgba(0,0,0,0.55),
            0 0 80px rgba(139,92,246,0.07),
            inset 0 1px 0 rgba(255,255,255,0.07);
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* ── Brand ── */
        .brand-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 32px;
        }
        .brand-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(139,92,246,0.35);
        }
        .brand-text .eyebrow {
          font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: var(--accent); display: block; margin-bottom: 2px;
        }
        .brand-text h1 {
          font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
          color: var(--text); line-height: 1.1;
        }

        /* ── Heading ── */
        .form-heading { margin-bottom: 28px; }
        .form-heading h2 {
          font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
          line-height: 1.15; margin-bottom: 6px;
          background: linear-gradient(120deg, #f1f0f9 30%, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .form-heading p { color: var(--muted); font-size: 14px; line-height: 1.6; font-weight: 300; }

        /* ── Alert ── */
        .alert-box {
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          color: var(--error);
          font-size: 13px;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }

        /* ── Inputs ── */
        .field { margin-bottom: 18px; }
        .field-label {
          display: block; font-size: 12px; font-weight: 500;
          color: var(--muted); margin-bottom: 8px;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .field-wrap { position: relative; }
        .field-wrap input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 13px 16px;
          font-size: 15px; color: var(--text);
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .field-wrap input::placeholder { color: rgba(241,240,249,0.22); }
        .field-wrap input:focus {
          border-color: var(--accent);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12), 0 0 20px rgba(139,92,246,0.08);
        }
        .field-focus-bar {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          height: 2px; background: linear-gradient(90deg, #8b5cf6, #06b6d4);
          border-radius: 2px; transition: width 0.3s ease;
          width: 0;
        }
        .field-wrap:focus-within .field-focus-bar { width: calc(100% - 24px); }

        /* ── Options row ── */
        .options-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; margin-top: -4px;
        }
        .check-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--muted); cursor: pointer;
        }
        .check-label input[type="checkbox"] {
          width: 15px; height: 15px; accent-color: var(--accent);
        }
        .forgot-link {
          font-size: 13px; color: var(--accent); text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #a78bfa; }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #06b6d4 100%);
          background-size: 200% 200%;
          border: none; border-radius: var(--radius-sm);
          color: #fff; font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.04em;
          cursor: pointer; position: relative; overflow: hidden;
          transition: box-shadow 0.3s, transform 0.15s;
          animation: gradShift 4s ease infinite;
        }
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .submit-btn:hover {
          box-shadow: 0 8px 32px rgba(139,92,246,0.45), 0 0 0 1px rgba(139,92,246,0.3);
          transform: translateY(-1px);
        }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn .btn-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .submit-btn:hover .btn-shimmer { transform: translateX(100%); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* ── Trust strip ── */
        .trust-row {
          display: flex; gap: 8px; margin-top: 20px; flex-wrap: wrap;
        }
        .trust-badge {
          display: flex; align-items: center; gap: 5px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 20px; padding: 4px 10px;
          font-size: 11px; color: var(--muted); font-weight: 500;
        }
        .trust-badge .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        /* ── Footer ── */
        .form-footer {
          text-align: center; margin-top: 22px;
          font-size: 13px; color: var(--muted);
        }
        .form-footer a {
          color: var(--accent); text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .form-footer a:hover { color: #a78bfa; }

        /* ── Showcase side ── */
        .auth-showcase {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px 56px;
        }

        .showcase-inner { max-width: 500px; }

        .showcase-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
          border-radius: 20px; padding: 6px 14px;
          font-size: 11px; font-weight: 600; color: var(--accent);
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 24px;
        }

        .showcase-heading {
          font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800;
          line-height: 1.1; margin-bottom: 20px;
          background: linear-gradient(135deg, #f1f0f9 0%, #a78bfa 50%, #06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .showcase-desc {
          color: var(--muted); font-size: 15px; line-height: 1.7;
          font-weight: 300; margin-bottom: 40px;
        }

        /* ── Stats card ── */
        .stats-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          backdrop-filter: blur(16px);
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .stat-cell { text-align: center; }
        .stat-label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--text); }

        /* ── Status strip ── */
        .status-strip {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px;
        }
        .status-pill {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 20px; padding: 6px 14px;
          font-size: 12px; color: var(--muted);
        }
        .status-pill.online { border-color: rgba(16,185,129,0.3); color: #10b981; }

        /* ── Mini bar chart ── */
        .chart-label {
          font-size: 11px; color: var(--muted); margin-bottom: 10px;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .mini-bars {
          display: flex; align-items: flex-end; gap: 6px; height: 60px;
        }
        .bar-wrap {
          flex: 1; height: 100%; display: flex; align-items: flex-end;
          border-radius: 6px; background: rgba(255,255,255,0.04); overflow: hidden;
        }
        .bar-fill {
          width: 100%; border-radius: 6px;
          background: linear-gradient(180deg, #8b5cf6 0%, #06b6d4 100%);
          transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0.7;
        }

        /* ── Loading spinner ── */
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px;
          background: var(--border);
        }
        .divider span { font-size: 11px; color: var(--muted); }
      `}</style>

      <div className="auth-root">
        <ParticleCanvas />
        <div className="bg-gradient" />
        <OrbField />
        <div className="grid-overlay" />

        {/* ─── Form Side ─── */}
        <div className="auth-form-side">
          <motion.div
            className="glass-panel"
            style={{ rotateX: panelRotateX, rotateY: panelRotateY }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Brand */}
            <motion.div
              className="brand-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="brand-icon">🎓</div>
              <div className="brand-text">
                <span className="eyebrow">StudentHub ERP</span>
                <h1>College Suite</h1>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              className="form-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2>Welcome back</h2>
              <p>Sign in to manage admissions, attendance, fees, results, and reports.</p>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="alert-box"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fields */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@college.edu' },
                { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              ].map((f, i) => (
                <motion.div
                  key={f.id}
                  className="field"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, duration: 0.4 }}
                >
                  <label className="field-label" htmlFor={f.id}>{f.label}</label>
                  <div className="field-wrap">
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.id]}
                      onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                      onFocus={() => setFocused(f.id)}
                      onBlur={() => setFocused(null)}
                      required
                    />
                    <div className="field-focus-bar" />
                  </div>
                </motion.div>
              ))}

              <div className="options-row">
                <label className="check-label">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="btn-shimmer" />
                {loading ? <span className="spinner" /> : 'Sign In →'}
              </motion.button>
            </motion.form>

            {/* Trust badges */}
            <motion.div
              className="trust-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              {['JWT Secured', 'Role Access', isOnline ? 'DB Connected' : 'DB Syncing'].map((t, i) => (
                <span className="trust-badge" key={t}>
                  {i === 2 && <span className="dot" />}
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.p
              className="form-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              New to StudentHub? <Link to="/register">Create account</Link>
            </motion.p>
          </motion.div>
        </div>

        {/* ─── Showcase Side ─── */}
        <motion.aside
          className="auth-showcase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="showcase-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="showcase-badge">
                <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
                Live Dashboard
              </div>
            </motion.div>

            <motion.h2
              className="showcase-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Your institution's command center
            </motion.h2>

            <motion.p
              className="showcase-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Approve registrations, track attendance, manage fees, publish results, and generate reports — all in one fast, modern workflow.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="stats-card"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.55 }}
            >
              <AnimatedStat label="Students" value={summary.students} />
              <AnimatedStat label="Attendance" value={summary.attendance} suffix="%" />
              <AnimatedStat label="Pending Fees" value={summary.pendingFees} />
            </motion.div>

            {/* Status pills */}
            <motion.div
              className="status-strip"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <span className="status-pill">{summary.courses} courses</span>
              <span className="status-pill">{summary.pendingApprovals} approvals pending</span>
              <span className={`status-pill ${isOnline ? 'online' : ''}`}>
                {isOnline ? '● MongoDB connected' : '○ Connecting…'}
              </span>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="chart-label">Weekly Attendance Trend</p>
              <div className="mini-bars">
                {[55, 72, 48, 88, 64, 76, 91].map((h, i) => (
                  <motion.div
                    key={i}
                    className="bar-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.06 }}
                  >
                    <motion.div
                      className="bar-fill"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1 + i * 0.07, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.aside>
      </div>
    </>
  );
}
