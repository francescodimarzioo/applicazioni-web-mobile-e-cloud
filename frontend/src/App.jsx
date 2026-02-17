import { useEffect, useMemo, useState } from "react";
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
            .filter(Boolean) // <-- FIX: prima era ".filte"
        )
      );

      await addExpense({
        description: description.trim(),
        amount: Number(amount),
        paidBy: paidBy.trim(),
        participants: parsedParticipants,
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

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const count = expenses.length;
    return { total, count };
  }, [expenses]);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="header">
          <div>
            <h1 className="title">ExpenseSplitApp</h1>
            <p className="sub">Accedi o registrati per gestire le spese.</p>
          </div>
        </div>

        <div className="grid2">
          <div className="card">
            <div className="cardHeader">
              <h2 className="title" style={{ fontSize: 18 }}>Login</h2>
            </div>

            <form onSubmit={handleLogin}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <div style={{ height: 10 }} />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <div style={{ height: 12 }} />

              <button className="btn btnPrimary" type="submit">
                Login
              </button>

              {error && <div className="alert">{error}</div>}
            </form>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h2 className="title" style={{ fontSize: 18 }}>Register</h2>
            </div>

            <form onSubmit={handleRegister}>
              <label className="label">Nome e Cognome</label>
              <input
                className="input"
                type="text"
                placeholder="Inserisci il tuo nome e cognome"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <div style={{ height: 10 }} />

              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <div style={{ height: 10 }} />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <div style={{ height: 12 }} />

              <button className="btn" type="submit">
                Register
              </button>

              {error && <div className="alert">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">ExpenseSplitApp</h1>
          <p className="sub">
            {stats.count} spese totali • Totale: <strong>€ {stats.total.toFixed(2)}</strong>
          </p>
        </div>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <h2 className="title" style={{ fontSize: 18 }}>Aggiungi spesa</h2>
          </div>

          <form onSubmit={handleAddExpense}>
            <label className="label">Descrizione</label>
            <input
              className="input"
              type="text"
              placeholder="Es. Cena, Benzina…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />

            <div style={{ height: 10 }} />

            <label className="label">Importo</label>
            <input
              className="input"
              type="number"
              placeholder="Es. 25"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />

            <div style={{ height: 10 }} />

            <label className="label">Pagato da</label>
            <input
              className="input"
              type="text"
              placeholder="Es. Luca"
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              required
            />

            <div style={{ height: 10 }} />

            <label className="label">Partecipanti (separati da virgola)</label>
            <input
              className="input"
              type="text"
              placeholder="Es. Luca, Anna, Marco"
              value={participants}
              onChange={e => setParticipants(e.target.value)}
            />

            <div style={{ height: 12 }} />

            <div className="actionsRow">
              <button className="btn btnPrimary" type="submit">
                Aggiungi
              </button>
            </div>

            {error && <div className="alert">{error}</div>}
          </form>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h2 className="title" style={{ fontSize: 18 }}>Lista spese</h2>
          </div>

          {expenses.length === 0 ? (
            <p className="sub">Nessuna spesa inserita.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrizione</th>
                  <th>Importo</th>
                  <th>Pagato da</th>
                  <th>Partecipanti</th>
                  <th>Quota</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id}>
                    <td data-label="Descrizione"><strong>{exp.description}</strong></td>
                    <td data-label="Importo">€ {Number(exp.amount).toFixed(2)}</td>
                    <td data-label="Pagato da">{exp.paidBy}</td>
                    <td data-label="Partecipanti">{(exp.participants || []).join(", ")}</td>
                    <td data-label="Quota">€ {Number(exp.splitAmount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;