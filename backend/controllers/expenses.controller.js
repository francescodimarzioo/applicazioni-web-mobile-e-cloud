import Expense from "../models/ExpenseModel.js";

// GET spese dell'utente loggato
export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ owner: req.user.sub });
    res.json(expenses);
  } catch {
    res.status(500).json({ error: "Errore nel recupero spese" });
  }
}

// POST nuova spesa dell'utente loggato
export async function createExpense(req, res) {
  try {
    const { description, amount, paidBy, participants } = req.body;

    const splitAmount = amount / participants.length;

    const expense = new Expense({
      owner: req.user.sub,
      description,
      amount,
      paidBy,
      participants,
      splitAmount
    });

    await expense.save();
    res.json(expense);
  } catch {
    res.status(500).json({ error: "Errore nel salvataggio spesa" });
  }
}