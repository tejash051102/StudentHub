export default function Assistant() {
  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">Smart Helpdesk</span><h1>AI Assistant</h1><p>Ask natural language questions about students, attendance, fees, and reports.</p></div></div>
      <section className="hero-panel"><div><span className="eyebrow">Final-Year Feature</span><h2>StudentHub AI can summarize records, find students, and draft report insights.</h2><p>Connect an AI provider key later to activate live responses.</p></div><div className="metric-ring"><strong>AI</strong><span>Ready</span></div></section>
      <section className="panel"><label>Ask StudentHub<input placeholder="Example: Show students with low attendance and pending fees" /></label><div className="actions"><button type="button">Ask Assistant</button><button type="button" className="ghost-button">Generate Summary</button></div></section>
    </section>
  );
}
