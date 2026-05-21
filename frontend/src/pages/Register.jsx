import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  enrollmentNumber: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  department: '',
  course: '',
  semester: '',
  address: '',
  profilePhoto: null,
  password: '',
  confirmPassword: '',
  acceptedTerms: false
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const previewUrl = useMemo(
    () => (form.profilePhoto ? URL.createObjectURL(form.profilePhoto) : '/assets/studenthub-logo.png'),
    [form.profilePhoto]
  );

  const passwordScore = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const progress = useMemo(() => {
    const fields = ['name', 'enrollmentNumber', 'email', 'phone', 'gender', 'dateOfBirth', 'department', 'course', 'semester', 'address', 'password', 'confirmPassword'];
    const filled = fields.filter((field) => Boolean(form[field])).length + (form.acceptedTerms ? 1 : 0);
    return Math.round((filled / (fields.length + 1)) * 100);
  }, [form]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validateForm() {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.enrollmentNumber.trim()) return 'Student ID / Enrollment Number is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address';
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) return 'Enter a valid phone number';
    if (!form.gender) return 'Please select gender';
    if (!form.dateOfBirth) return 'Date of birth is required';
    if (!form.department.trim()) return 'Department is required';
    if (!form.course.trim()) return 'Course is required';
    if (!form.semester.trim()) return 'Semester / Year is required';
    if (passwordScore < 3) return 'Use a stronger password with uppercase, number, or symbol';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (!form.acceptedTerms) return 'Please accept the terms and conditions';
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) payload.append(key, value);
      });
      await register(payload);
      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-screen">
      <motion.form
        className="auth-panel wide"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <div>
          <img className="auth-logo" src="/assets/studenthub-logo.png" alt="StudentHub logo" />
          <span className="eyebrow">StudentHub</span>
          <h1>Create institution account</h1>
          <p>Set up an admin workspace for your college or academic department.</p>
        </div>
        <div className="form-progress" aria-label="Registration progress">
          <span><b style={{ width: `${progress}%` }} /></span>
          <strong>{progress}% complete</strong>
        </div>
        {error && <p className="alert">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="upload-preview">
          <img src={previewUrl} alt="Profile preview" />
          <label>
            Profile Photo Upload
            <input
              type="file"
              accept="image/*"
              onChange={(event) => updateField('profilePhoto', event.target.files?.[0] || null)}
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Full Name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </label>
          <label>
            Student ID / Enrollment Number
            <input
              value={form.enrollmentNumber}
              onChange={(event) => updateField('enrollmentNumber', event.target.value)}
              required
            />
          </label>
          <label>
            Email Address
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </label>
          <label>
            Phone Number
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} required />
          </label>
          <label>
            Gender
            <select value={form.gender} onChange={(event) => updateField('gender', event.target.value)} required>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </label>
          <label>
            Date of Birth
            <input type="date" value={form.dateOfBirth} onChange={(event) => updateField('dateOfBirth', event.target.value)} required />
          </label>
          <label>
            Department
            <input value={form.department} onChange={(event) => updateField('department', event.target.value)} required />
          </label>
          <label>
            Course
            <input value={form.course} onChange={(event) => updateField('course', event.target.value)} required />
          </label>
          <label>
            Semester / Year
            <input value={form.semester} onChange={(event) => updateField('semester', event.target.value)} required />
          </label>
          <label>
            Password
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              minLength="8"
              required
            />
            <span className={`password-strength score-${passwordScore}`}>
              <b />
              {['Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
            </span>
          </label>
          <label>
            Confirm Password
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              minLength="8"
              required
            />
          </label>
          <label className="span-2">
            Address
            <input value={form.address} onChange={(event) => updateField('address', event.target.value)} required />
          </label>
        </div>
        <label className="checkbox-row">
          <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
          Show password
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.acceptedTerms}
            onChange={(event) => updateField('acceptedTerms', event.target.checked)}
          />
          I agree to the terms and conditions
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        <p>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </motion.form>
    </section>
  );
}
