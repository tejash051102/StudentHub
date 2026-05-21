export default function Security() {
  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">Authentication</span><h1>Security</h1><p>Manage role-based access, verification, refresh sessions, and audit controls.</p></div></div>
      <section className="settings-grid">
        {['Role-Based Routes', 'Email OTP Verification', 'Refresh Tokens', 'Login Lockout', 'Activity Logs', 'Protected APIs'].map((item) => <article className="settings-card" key={item}><div><h2>{item}</h2><p>Configured foundation for production security workflows.</p></div><span className="status-pill">Enabled</span></article>)}
      </section>
    </section>
  );
}
