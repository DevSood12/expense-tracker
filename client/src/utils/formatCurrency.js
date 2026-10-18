// Formats numbers as Indian Rupees, e.g. 1500 -> ₹1,500.00
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);