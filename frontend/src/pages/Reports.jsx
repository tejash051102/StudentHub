import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { downloadCsv, printHtml } from '../utils/reports.js';

export default function Reports() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/students?limit=50').then(({ data }) => setStudents(data.students));
  }, []);

  function exportStudents() {
    downloadCsv('studenthub-students.csv', [
      ['Name', 'Roll Number', 'Department', 'Course', 'Status'],
      ...students.map((student) => [`${student.firstName} ${student.lastName}`, student.rollNumber, student.department, student.course, student.status])
    ]);
  }

  function printStudentReport() {
    printHtml('StudentHub Student Report', `<h1>StudentHub Student Report</h1><table><tr><th>Name</th><th>Roll</th><th>Department</th><th>Course</th></tr>${students.map((student) => `<tr><td>${student.firstName} ${student.lastName}</td><td>${student.rollNumber}</td><td>${student.department}</td><td>${student.course}</td></tr>`).join('')}</table>`);
  }

  return (
    <section className="page">
      <div className="page-heading"><div><span className="eyebrow">PDF and Excel</span><h1>Reports</h1><p>Export student profiles, attendance, fees, and results for administration.</p></div></div>
      <section className="settings-grid">
        <article className="settings-card"><div><h2>Student CSV Export</h2><p>Download student records for Excel.</p></div><button type="button" onClick={exportStudents}>Export CSV</button></article>
        <article className="settings-card"><div><h2>Printable PDF Report</h2><p>Open a print-ready report for PDF saving.</p></div><button type="button" onClick={printStudentReport}>Print PDF</button></article>
        <article className="settings-card"><div><h2>ID Card Print</h2><p>Generate printable student identity cards.</p></div><button type="button" className="ghost-button">Generate</button></article>
      </section>
    </section>
  );
}
