import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/erp/events').then(({ data }) => setEvents(data));
  }, []);

  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">Exams, Events, Deadlines</span><h1>Calendar</h1><p>Plan academic events, examinations, meetings, and submission deadlines.</p></div><button type="button">Add Event</button></div>
      <section className="panel"><div className="calendar-grid">{Array.from({ length: 30 }, (_, index) => <div key={index} className="calendar-day"><strong>{index + 1}</strong>{events[index] && <span>{events[index].title}</span>}</div>)}</div></section>
    </section>
  );
}
