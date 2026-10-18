import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownCircle, ArrowUpCircle, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';

const SummaryCard = ({ label, value, icon: Icon, iconColor, iconBg, valueColor = '' }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`${iconBg} p-3 rounded-full`}>
      <Icon className={iconColor} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{formatCurrency(value)}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { summary, transactions, fetchSummary, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [fetchSummary, fetchTransactions]);

  if (!summary) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your financial overview.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Income"
          value={summary.totalIncome}
          icon={ArrowUpCircle}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <SummaryCard
          label="Total Expense"
          value={summary.totalExpense}
          icon={ArrowDownCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <SummaryCard
          label="Net Balance"
          value={summary.netBalance}
          icon={Scale}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          valueColor={summary.netBalance < 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      {/* Chart + recent transactions side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Spending by Category</h2>
          {summary.categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500">No expenses yet.</p>
          ) : (
            <CategoryPieChart data={summary.categoryBreakdown} />
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-indigo-600 hover:underline">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((t) => (
                <li key={t._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t.category}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span
                    className={`font-semibold ${
                      t.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;