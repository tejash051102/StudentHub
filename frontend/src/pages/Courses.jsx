import { useEffect, useState } from 'react';
import api from '../api/client.js';

const emptyCourse = {
  name: '',
  code: '',
  department: '',
  duration: '',
  credits: 1,
  description: ''
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourse);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data } = await api.get('/courses');
    setCourses(data);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await api.post('/courses', form);
    setForm(emptyCourse);
    loadCourses();
  }

  async function removeCourse(id) {
    await api.delete(`/courses/${id}`);
    loadCourses();
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Academics</span>
          <h1>Courses</h1>
        </div>
      </div>

      <form className="panel record-form" onSubmit={handleSubmit}>
        <h2>Add Course</h2>
        <div className="form-grid">
          {[
            ['name', 'Course Name'],
            ['code', 'Course Code'],
            ['department', 'Department'],
            ['duration', 'Duration']
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input
                value={form[name]}
                onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                required
              />
            </label>
          ))}
          <label>
            Credits
            <input
              type="number"
              min="1"
              value={form.credits}
              onChange={(event) => setForm({ ...form, credits: Number(event.target.value) })}
              required
            />
          </label>
          <label className="span-2">
            Description
            <input
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
        </div>
        <button type="submit">Save Course</button>
      </form>

      <section className="course-grid">
        {courses.map((course) => (
          <article key={course._id} className="course-card">
            <div>
              <strong>{course.code}</strong>
              <h2>{course.name}</h2>
              <p>{course.description || 'No description added.'}</p>
            </div>
            <div className="course-meta">
              <span>{course.department}</span>
              <span>{course.duration}</span>
              <span>{course.credits} credits</span>
            </div>
            <button type="button" className="small-button danger" onClick={() => removeCourse(course._id)}>
              Delete
            </button>
          </article>
        ))}
      </section>
    </section>
  );
}
