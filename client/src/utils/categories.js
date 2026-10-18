// Fixed category lists (categories are a plain String in the DB, so the list lives here)
export const CATEGORIES = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
};

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'other', label: 'Other' },
];