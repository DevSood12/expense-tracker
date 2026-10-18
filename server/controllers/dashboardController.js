import Transaction from "../models/Transaction.js";

// @desc    Get dashboard summary (totals + category breakdown) for logged-in user
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate total income and total expense
    const totals = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // totals looks like: [ { _id: 'income', total: 5000 }, { _id: 'expense', total: 3200 } ]
    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((entry) => {
      if (entry._id === "income") totalIncome = entry.total;
      if (entry._id === "expense") totalExpense = entry.total;
    });

    const netBalance = totalIncome - totalExpense;

    // Aggregate expense totals grouped by category (for the pie chart)
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Reshape into a cleaner format: [{ category: 'Food', total: 1200 }, ...]
    const formattedBreakdown = categoryBreakdown.map((item) => ({
      category: item._id,
      total: item.total,
    }));

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        categoryBreakdown: formattedBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};
