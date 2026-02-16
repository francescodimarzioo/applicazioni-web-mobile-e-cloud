import Expense from "../models/ExpenseModel.js";

// GET spese dell'utente loggato
export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ owner: req.user.sub });
    res.json(expenses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Errore nel recupero spese" });
  }
}

// POST nuova spesa dell'utente loggato
export async function createExpense(req, res) {
  try {
    const { description, amount, paidBy, participants } = req.body;

    // 1) Normalizza partecipanti (trim, rimuovi vuoti, rimuovi duplicati)
    const cleanedParticipants = Array.from(
      new Set((participants || []).map(p => String(p).trim()).filter(Boolean))
    );

    // 2) Normalizza pagante
    const cleanedPaidBy = String(paidBy || "").trim();
    if (!cleanedPaidBy) {
      return res.status(400).json({ message: "Inserisci 'Pagato da'" });
    }

    // 3) Include sempre il pagante nella lista se non c'è già
    if (!cleanedParticipants.includes(cleanedPaidBy)) {
      cleanedParticipants.push(cleanedPaidBy);
    }

    // 4) Validazione lista persone
    if (cleanedParticipants.length === 0) {
      return res.status(400).json({ message: "Inserisci almeno una persona" });
    }

    // 5) Validazione importo
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Importo non valido" });
    }

    // 6) Split tra partecipanti + pagante
    const splitAmount = numericAmount / cleanedParticipants.length;

    const expense = new Expense({
      owner: req.user.sub,
      description,
      amount: numericAmount,
      paidBy: cleanedPaidBy,
      participants: cleanedParticipants,
      splitAmount
    });

    await expense.save();
    res.json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Errore nel salvataggio spesa" });
  }
}
