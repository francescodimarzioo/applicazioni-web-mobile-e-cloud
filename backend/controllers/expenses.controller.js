import { expenses } from "../data/store.js";
import Expense from "../models/Expense.js";
import { v4 as uuid } from "uuid";

export function createExpense(req, res) {
  const { description, amount, paidBy, participants } = req.body;

  if (!description || !amount || !participants) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  const expense = new Expense(
    uuid(),
    description,
    amount,
    paidBy,
    participants
  );

  expenses.push(expense);

  res.json(expense);
}

export function getExpenses(req, res) {
  res.json(expenses);
}