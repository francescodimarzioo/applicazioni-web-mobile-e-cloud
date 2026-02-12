import { useEffect, useState } from "react";
import { getExpenses, addExpense } from "./api";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [names, setNames] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getExpenses();
      setExpenses(data);
    }

    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!desc || !amount || !names) return;

    // trasformiamo la stringa in array
    const participants = names
      .split(",")
      .map(name => name.trim())
      .filter(name => name !== "");

    if (participants.length === 0) return;

    await addExpense({
      description: desc,
      amount: Number(amount),
      paidBy: participants[0],
      participants: participants
    });

    setDesc("");
    setAmount("");
    setNames("");

    const data = await getExpenses();
    setExpenses(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Expense Split App</h1>

      <input
        placeholder="Descrizione"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        type="number"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Nomi separati da virgola (es: Luca, Marco, Anna)"
        value={names}
        onChange={(e) => setNames(e.target.value)}
      />

      <button onClick={handleAdd}>Aggiungi</button>

      <ul>
  {expenses.map((e) => {
    const participantsCount = e.participants?.length || 1;
    const split = (e.amount / participantsCount).toFixed(2);

    return (
      <li key={e._id} style={{ marginBottom: 20 }}>
        <strong>{e.description}</strong> – {e.amount}€

        <div style={{ marginTop: 10 }}>
          {e.participants?.map((name, index) => (
            <div key={index}>
              {name} → {split}€
            </div>
          ))}
        </div>
      </li>
    );
  })}
</ul>
    </div>
  );
}