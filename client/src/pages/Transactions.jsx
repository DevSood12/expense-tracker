import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext.jsx';
import TransactionForm from '../components/transactions/TransactionForm.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const Transactions = () => {
  const {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useTransactions();
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = (data) => addTransaction(data);

  const handleEdit = async (data) => {
    await editTransaction(editing._id, data);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      await removeTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      {/* key forces a fresh form when switching between add and edit */}
      {editing ? (
        <TransactionForm
          key={editing._id}
          initial={editing}
          onSubmit={handleEdit}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <TransactionForm key="new" onSubmit={handleAdd} />
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {loading && <p className="p-4 text-sm text-gray-500">Loading...</p>}

        {!loading && transactions.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No transactions yet.</p>
        )}

        {transactions.map((t) => (
          <div key={t._id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
  {t.category}
</span>
              <p className="text-xs text-gray-500 truncate">
                {new Date(t.date).toLocaleDateString('en-IN')}
                {t.description && ` · ${t.description}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`font-semibold ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </span>
              <button onClick={() => setEditing(t)} className="text-gray-400 hover:text-indigo-600">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;