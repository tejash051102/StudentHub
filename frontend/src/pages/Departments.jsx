const departments = [
  { name: 'Computer Science', head: 'Dr. Meera Rao', students: 420, courses: 18, strength: 92 },
  { name: 'Business Administration', head: 'Prof. Arjun Mehta', students: 315, courses: 12, strength: 84 },
  { name: 'Mechanical Engineering', head: 'Dr. Nikhil Shah', students: 278, courses: 15, strength: 78 },
  { name: 'Data Science', head: 'Prof. Aisha Khan', students: 196, courses: 9, strength: 88 }
];

export default function Departments() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Academic Structure</span>
          <h1>Departments</h1>
          <p>Track department capacity, assigned courses, and student distribution.</p>
        </div>
        <button type="button">Add Department</button>
      </div>

      <div className="department-grid">
        {departments.map((department) => (
          <article className="department-card" key={department.name}>
            <div className="department-head">
              <span>{department.name.slice(0, 2).toUpperCase()}</span>
              <div>
                <h2>{department.name}</h2>
                <p>{department.head}</p>
              </div>
            </div>
            <div className="detail-grid">
              <span>Students<strong>{department.students}</strong></span>
              <span>Courses<strong>{department.courses}</strong></span>
            </div>
            <div className="progress-row">
              <div>
                <span>Capacity</span>
                <strong>{department.strength}%</strong>
              </div>
              <i><b style={{ width: `${department.strength}%` }} /></i>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
