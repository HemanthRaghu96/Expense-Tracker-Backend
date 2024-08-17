const Expense = require('../models/expenseSchema');

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  const expense = new Expense({
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    description: req.body.description,
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single expense
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (expense == null) {
      return res.status(404).json({ message: 'Cannot find expense' });
    }
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id, 
        {
          $set: {
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            description: req.body.description,
          },
        },
        { new: true } 
      );
      if (!updatedExpense) {
        return res.status(404).json({ message: 'Cannot find expense' });
      }
      res.status(200).json(updatedExpense);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (expense == null) {
      return res.status(404).json({ message: 'Cannot find expense' });
    }
    res.status(200).json({ message: 'Deleted Expense' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
