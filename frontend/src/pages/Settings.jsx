export default function Settings() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Workspace</span>
          <h1>Settings</h1>
          <p>Configure StudentHub preferences for security, notifications, and data workflows.</p>
        </div>
      </div>

      <section className="settings-grid">
        {[
          ['Email Notifications', 'Send enrollment, attendance, and profile updates to administrators.'],
          ['Role Permissions', 'Prepare role-based access for department heads and office staff.'],
          ['Data Backup', 'Schedule secure exports for student, course, and department records.'],
          ['Appearance', 'Use the topbar theme switch to move between light and dark mode.']
        ].map(([title, description]) => (
          <article className="settings-card" key={title}>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked={title !== 'Role Permissions'} />
              <span />
            </label>
          </article>
        ))}
      </section>
    </section>
  );
}
