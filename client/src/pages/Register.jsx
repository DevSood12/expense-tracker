import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
          <Wallet size={28} />
        </div>
        <span className="text-3xl font-bold text-gray-900">
          Expense<span className="text-indigo-600">Tracker</span>
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start tracking your income and expenses.</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white font-medium rounded-lg py-2.5 hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;