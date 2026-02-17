import Expense from "../models/ExpenseModel.js";

export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ owner: req.user.sub }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Errore server" });
  }
}

export async function createExpense(req, res) {
  try {
    const { description, amount, paidBy, participants } = req.body;

    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: "Descrizione obbligatoria" });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Importo non valido" });
    }

    const cleanedPaidBy = String(paidBy || "").trim();

    const cleanedParticipants = Array.from(
      new Set((participants || []).map(p => String(p).trim()).filter(Boolean))
    );

    if (cleanedPaidBy && !cleanedParticipants.includes(cleanedPaidBy)) {
      cleanedParticipants.push(cleanedPaidBy);
    }

    if (cleanedParticipants.length === 0) {
      return res.status(400).json({ message: "Inserisci almeno un partecipante" });
    }

    const expense = await Expense.create({
      owner: req.user.sub,
      description: String(description).trim(),
      amount: numericAmount,
      paidBy: cleanedPaidBy,
      participants: cleanedParticipants,
      splitAmount: numericAmount / cleanedParticipants.length
    });

    res.status(201).json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Errore server" });
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Spesa non trovata" });

    if (expense.owner.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Non sei autorizzato" });
    }

    const { description, amount, paidBy, participants } = req.body;

    if (description !== undefined) expense.description = String(description).trim();

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: "Importo non valido" });
      }
      expense.amount = numericAmount;
    }

    if (paidBy !== undefined) expense.paidBy = String(paidBy).trim();

    if (participants !== undefined) {
      const cleanedParticipants = Array.from(
        new Set((participants || []).map(p => String(p).trim()).filter(Boolean))
      );

      const cleanedPaidBy = String(expense.paidBy || "").trim();
      if (cleanedPaidBy && !cleanedParticipants.includes(cleanedPaidBy)) {
        cleanedParticipants.push(cleanedPaidBy);
      }

      expense.participants = cleanedParticipants;

      const count = cleanedParticipants.length || 1;
      expense.splitAmount = expense.amount / count;
    } else {
      const count = (expense.participants?.length || 0) || 1;
      expense.splitAmount = expense.amount / count;
    }

    await expense.save();
    res.json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Errore server" });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Spesa non trovata" });

    if (expense.owner.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Non sei autorizzato" });
    }

    await expense.deleteOne();
    res.json({ message: "Spesa eliminata" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Errore server" });
  }
}
