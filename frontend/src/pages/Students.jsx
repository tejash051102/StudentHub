import { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const emptyStudent = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  rollNumber: '',
  department: '',
  course: '',
  semester: 1,
  enrollmentYear: new Date().getFullYear(),
  status: 'Active',
  address: ''
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    loadStudents();
  }, [query]);

  async function loadStudents() {
    const { data } = await api.get(`/students?${query}`);
    setStudents(data.students);
    setPagination(data.pagination);
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (editingId) {
      await api.put(`/students/${editingId}`, form);
      setMessage('Student updated successfully');
    } else {
      await api.post('/students', form);
      setMessage('Student added successfully');
    }

    setEditingId(null);
    setForm(emptyStudent);
    setFormOpen(false);
    loadStudents();
  }

  function startEdit(student) {
    setEditingId(student._id);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      department: student.department,
      course: student.course,
      semester: student.semester,
      enrollmentYear: student.enrollmentYear,
      status: student.status,
      address: student.address || ''
    });
    setFormOpen(true);
  }

  async function removeStudent(id) {
    await api.delete(`/students/${id}`);
    loadStudents();
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Student Management</span>
          <h1>Students</h1>
          <p>Add, update, view, and organize student records with filters and pagination.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyStudent);
            setFormOpen(true);
          }}
        >
          Add Student
        </button>
      </div>

      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Student Directory</h2>
            <p>{pagination.total} records found</p>
          </div>
          {message && <p className="success inline-message">{message}</p>}
        </div>
        <div className="toolbar">
          <label className="search-field">
            <span>Search</span>
            <input
              placeholder="Search by name, roll no., email..."
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })}
            />
          </label>
          <input
            placeholder="Department"
            value={filters.department}
            onChange={(event) => setFilters({ ...filters, department: event.target.value, page: 1 })}
          />
          <select
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}
          >
            <option value="">All status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Graduated</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Course</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <strong>
                      {student.firstName} {student.lastName}
                    </strong>
                    <small>{student.email}</small>
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.course}</td>
                  <td>
                    <span className="status-pill">{student.status}</span>
                  </td>
                  <td>
                    <button type="button" className="small-button ghost-button" onClick={() => setViewStudent(student)}>
                      View
                    </button>
                    <button type="button" className="small-button" onClick={() => startEdit(student)}>
                      Edit
                    </button>
                    <button type="button" className="small-button danger" onClick={() => removeStudent(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!students.length && <p className="muted empty-state">No matching students found.</p>}
        </div>
        <div className="pagination">
          <button
            type="button"
            className="ghost-button"
            disabled={pagination.page <= 1}
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            className="ghost-button"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      </section>

      {formOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal-panel record-form" onSubmit={handleSubmit}>
            <div className="modal-heading">
              <div>
                <span className="eyebrow">Student Record</span>
                <h2>{editingId ? 'Update Student' : 'Add Student'}</h2>
              </div>
              <button type="button" className="icon-button" aria-label="Close form" onClick={() => setFormOpen(false)}>
                X
              </button>
            </div>
            <div className="form-grid">
              {[
                ['firstName', 'First Name'],
                ['lastName', 'Last Name'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['rollNumber', 'Roll Number'],
                ['department', 'Department'],
                ['course', 'Course']
              ].map(([name, label]) => (
                <label key={name}>
                  {label}
                  <input
                    type={name === 'email' ? 'email' : 'text'}
                    value={form[name]}
                    onChange={(event) => updateField(name, event.target.value)}
                    required
                  />
                </label>
              ))}
              <label>
                Semester
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.semester}
                  onChange={(event) => updateField('semester', Number(event.target.value))}
                  required
                />
              </label>
              <label>
                Enrollment Year
                <input
                  type="number"
                  min="1990"
                  value={form.enrollmentYear}
                  onChange={(event) => updateField('enrollmentYear', Number(event.target.value))}
                  required
                />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Graduated</option>
                </select>
              </label>
              <label className="span-2">
                Address
                <input value={form.address} onChange={(event) => updateField('address', event.target.value)} />
              </label>
            </div>
            <div className="actions">
              <button type="submit">{editingId ? 'Update' : 'Save'} Student</button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyStudent);
                  setFormOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {viewStudent && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-panel student-profile-card">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">Student Details</span>
                <h2>
                  {viewStudent.firstName} {viewStudent.lastName}
                </h2>
              </div>
              <button type="button" className="icon-button" aria-label="Close details" onClick={() => setViewStudent(null)}>
                X
              </button>
            </div>
            <div className="detail-grid">
              <span>Email<strong>{viewStudent.email}</strong></span>
              <span>Phone<strong>{viewStudent.phone}</strong></span>
              <span>Roll Number<strong>{viewStudent.rollNumber}</strong></span>
              <span>Department<strong>{viewStudent.department}</strong></span>
              <span>Course<strong>{viewStudent.course}</strong></span>
              <span>Status<strong>{viewStudent.status}</strong></span>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
