const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense');

// Routes for expenses
router.get('/', expenseController.getAllExpenses);
router.post('/', expenseController.createExpense);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
