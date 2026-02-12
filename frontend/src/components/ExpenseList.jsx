import { useEffect, useState } from "react";
import { getExpenses } from "../api";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses().then(setExpenses);
  }, []);

  return (
    <ul>
      {expenses.map(e => (
        <li key={e.id}>
          {e.description} – {e.amount}€ → {e.splitAmount}€ ciascuno
        </li>
      ))}
    </ul>
  );
} 
