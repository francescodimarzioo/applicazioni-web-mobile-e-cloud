import { useEffect, useState } from "react";
import {
  login,
  register,
  getExpenses,
  addExpense
} from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState("");

  const [error, setError] = useState("");

  // Carica spese se loggato
 useEffect(() => {
  if (!isLoggedIn) return;

  async function fetchExpenses() {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento spese");
    }
  }

  fetchExpenses();
}, [isLoggedIn]);

  async function loadExpenses() {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento spese");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    try {
      await register({ name, email, password });
      alert("Registrazione completata, ora fai login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setExpenses([]);
  }

  async function handleAddExpense(e) {
    e.preventDefault();

    try {
      await addExpense({
        description,
        amount: Number(amount),
        paidBy,
        participants: participants.split(",").map(p => p.trim())
      });

      setDescription("");
      setAmount("");
      setPaidBy("");
      setParticipants("");

      loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  // 🔒 SE NON LOGGATO → LOGIN / REGISTER
  if (!isLoggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit">Login</button>
        </form>

        <hr style={{ margin: "30px 0" }} />

        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <br /><br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit">Register</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  // 🔓 SE LOGGATO → APP SPESE
  return (
    <div style={{ padding: 40 }}>
      <h1>Gestione Spese</h1>

      <button onClick={handleLogout}>Logout</button>

      <h2>Aggiungi Spesa</h2>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="number"
          placeholder="Importo"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Pagato da"
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Partecipanti (separati da virgola)"
          value={participants}
          onChange={e => setParticipants(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Aggiungi</button>
      </form>

      <h2>Lista Spese</h2>
      <ul>
        {expenses.map(exp => (
          <li key={exp._id}>
            {exp.description} - {exp.amount}€ (Pagato da {exp.paidBy})
          </li>
        ))}
      </ul>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
