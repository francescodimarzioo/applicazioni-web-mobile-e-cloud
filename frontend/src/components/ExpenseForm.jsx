import { useState } from "react";
import { addExpense } from "../api";

export default function ExpenseForm() {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const submit = async () => {
    await addExpense({
      description: desc,
      amount: Number(amount),
      paidBy: "u1",
      participants: ["u1", "u2", "u3"]
    });
  };

  return (
    <>
      <input
        placeholder="Descrizione"
        onChange={e => setDesc(e.target.value)}
      />
      <input
        type="number"
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={submit}>Aggiungi</button>
    </>
  );
}