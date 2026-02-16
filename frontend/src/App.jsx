import { useEffect, useState } from "react";
import { login, register, getExpenses, addExpense, clearToken, getToken } from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchExpenses() {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Errore nel caricamento spese");
      }
    }

    fetchExpenses();
  }, [isLoggedIn]);

  async function reloadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
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
      alert("Registrazione completata! Ora fai login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    setIsLoggedIn(false);
    setExpenses([]);
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setError("");

    try {
      const parsedParticipants = Array.from(
        new Set(
          participants
            .split(",")
            .map(p => p.trim())
            .filter(Boolean)
        )
      );

      await addExpense({
        description: description.trim(),
        amount: Number(amount),
        paidBy: paidBy.trim(),
        participants: parsedParticipants
      });

      setDescription("");
      setAmount("");
      setPaidBy("");
      setParticipants("");

      await reloadExpenses();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 40, maxWidth: 520 }}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10 }}
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10 }}
          />
          <br /><br />
          <button type="submit" style={{ padding: "10px 16px" }}>
            Login
          </button>
        </form>

        <hr style={{ margin: "30px 0" }} />

        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome (opzionale)"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
          <br /><br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10 }}
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10 }}
          />
          <br /><br />
          <button type="submit" style={{ padding: "10px 16px" }}>
            Register
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>ExpenseSplitApp</h1>
        <button onClick={handleLogout} style={{ padding: "10px 16px" }}>
          Logout
        </button>
      </div>

      <h2>Aggiungi Spesa</h2>
      <form onSubmit={handleAddExpense} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <input
          type="text"
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ padding: 10 }}
        />
        <input
          type="number"
          placeholder="Importo"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          style={{ padding: 10 }}
        />
        <input
          type="text"
          placeholder="Pagato da (nome)"
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
          required
          style={{ padding: 10 }}
        />
        <input
          type="text"
          placeholder="Partecipanti (separati da virgola) es: Luca, Anna"
          value={participants}
          onChange={e => setParticipants(e.target.value)}
          style={{ padding: 10 }}
        />
        <button type="submit" style={{ padding: "10px 16px", width: "fit-content" }}>
          Aggiungi
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}

      <h2 style={{ marginTop: 30 }}>Lista Spese</h2>

      {expenses.length === 0 ? (
        <p>Nessuna spesa inserita.</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {expenses.map(exp => (
            <li key={exp._id} style={{ marginBottom: 14 }}>
              <div>
                <strong>{exp.description}</strong> — {exp.amount}€
              </div>
              <div>Pagato da: <strong>{exp.paidBy}</strong></div>
              <div>
                Persone: <strong>{exp.participants?.length || 0}</strong> — quota a testa:{" "}
                <strong>{Number(exp.splitAmount).toFixed(2)}€</strong>
              </div>
              <div>
                Partecipanti: {exp.participants?.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
