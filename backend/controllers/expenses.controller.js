import Expense from "../models/ExpenseModel.js";

// GET tutte le spese
export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({});
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero spese" });
  }
}

// POST nuova spesa
export async function createExpense(req, res) {
  try {
    const { description, amount, paidBy, participants } = req.body;

    const splitAmount = amount / participants.length;

    const expense = new Expense({
      description,
      amount,
      paidBy,
      participants,
      splitAmount
    });

    await expense.save();

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Errore nel salvataggio spesa" });
  }
}