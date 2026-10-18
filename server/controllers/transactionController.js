import Transaction from "../models/Transaction.js";

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const { type, category, amount, description, date, paymentMethod } =
      req.body;

    if (!type || !category || !amount) {
      res.status(400);
      throw new Error("Please provide type, category, and amount");
    }

    if (!["income", "expense"].includes(type)) {
      res.status(400);
      throw new Error('Type must be either "income" or "expense"');
    }

    if (amount <= 0) {
      res.status(400);
      throw new Error("Amount must be greater than 0");
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date,
      paymentMethod,
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions for the logged-in user (with optional filters)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    // Ensure the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this transaction");
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this transaction");
    }

    const { type, category, amount, description, date, paymentMethod } =
      req.body;

    if (type && !["income", "expense"].includes(type)) {
      res.status(400);
      throw new Error('Type must be either "income" or "expense"');
    }

    if (amount !== undefined && amount <= 0) {
      res.status(400);
      throw new Error("Amount must be greater than 0");
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, category, amount, description, date, paymentMethod },
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this transaction");
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};
