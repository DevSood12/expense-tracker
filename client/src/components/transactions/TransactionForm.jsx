import { useState } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/categories.js';

const today = () => new Date().toISOString().slice(0, 10);

const TransactionForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(
    initial
      ? {
          type: initial.type,
          category: initial.category,
          amount: initial.amount,
          description: initial.description || '',
          date: initial.date.slice(0, 10),
          paymentMethod: initial.paymentMethod,
        }
      : {
          type: 'expense',
          category: CATEGORIES.expense[0],
          amount: '',
          description: '',
          date: today(),
          paymentMethod: 'cash',
        }
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Switching type resets category, since each type has its own list
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setForm({ ...form, type, category: CATEGORIES[type][0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
    >
      <h2 className="font-semibold">{initial ? 'Edit Transaction' : 'Add Transaction'}</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select name="type" value={form.type} onChange={handleTypeChange} className={inputClass}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
          {CATEGORIES[form.type].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
          className={inputClass}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className={inputClass}
        />

        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputClass}>
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          maxLength={200}
          className={inputClass}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : initial ? 'Update' : 'Add'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;