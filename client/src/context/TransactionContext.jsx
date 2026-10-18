import { createContext, useState, useContext, useCallback } from 'react';
import api from '../api/axios.js';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/transactions', { params: filters });
      setTransactions(data.transactions);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    const { data } = await api.get('/dashboard/summary');
    setSummary(data.summary);
  }, []);

  const addTransaction = async (transactionData) => {
    const { data } = await api.post('/transactions', transactionData);
    setTransactions((prev) => [data.transaction, ...prev]);
    await fetchSummary(); // Keep totals in sync after adding
    return data.transaction;
  };

  const editTransaction = async (id, transactionData) => {
    const { data } = await api.put(`/transactions/${id}`, transactionData);
    setTransactions((prev) =>
      prev.map((t) => (t._id === id ? data.transaction : t))
    );
    await fetchSummary();
    return data.transaction;
  };

  const removeTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    await fetchSummary();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        loading,
        fetchTransactions,
        fetchSummary,
        addTransaction,
        editTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};