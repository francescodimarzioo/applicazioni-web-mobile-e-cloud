import { useEffect, useMemo, useState } from "react";
import {
  login,
  register,
  getExpenses,
  addExpense,
  deleteExpense,
  clearToken,
  getToken,
} from "./api";

function App() {
  const [hasStarted, setHasStarted] = useState(false);
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

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    if (!hasStarted) return;
    if (!isLoggedIn) return;

    async function fetchExpenses() {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchExpenses();
  }, [hasStarted, isLoggedIn]);

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
            .map((p) => p.trim())
            .filter(Boolean)
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

  
  function handleDeleteExpense(id) {
    setExpenseToDelete(id);
    setShowDeleteModal(true);
  }

 
  async function confirmDelete() {
    if (!expenseToDelete) return;

    setError("");
    try {
      await deleteExpense(expenseToDelete);
      await reloadExpenses();
    } catch (err) {
      setError(err.message);
    }

    setShowDeleteModal(false);
    setExpenseToDelete(null);
  }

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return { total, count: expenses.length };
  }, [expenses]);

  function getSplitAmount(exp) {
    const backendSplit = Number(exp?.splitAmount);
    if (Number.isFinite(backendSplit) && backendSplit > 0) return backendSplit;

    const amt = Number(exp?.amount || 0);
    const n = Array.isArray(exp?.participants) ? exp.participants.length : 0;
    if (!n) return 0;
    return amt / n;
  }

  if (!hasStarted) {
    return (
      <div className="startPage">
        <div className="coinsBackground"></div>

        <div className="startContent">
          <h1 className="startTitle">ExpenseSplitApp</h1>
          <button
            className="btn btnPrimary startButton"
            onClick={() => setHasStarted(true)}
          >
            Avvia
          </button>
        </div>
      </div>
    );
  }

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
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div style={{ height: 12 }} />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div style={{ height: 16 }} />

              <button className="btn btnPrimary">Login</button>

              {error && <div className="alert">{error}</div>}
            </form>
          </div>

          <div className="card">
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
              <label className="label">Nome</label>
              <input
                className="input"
                type="text"
                placeholder="Francesco"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div style={{ height: 12 }} />

              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div style={{ height: 12 }} />

              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div style={{ height: 16 }} />

              <button className="btn">Register</button>
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
          <h1 className="title">Dashboard</h1>
          <p className="sub">
            {stats.count} spese • Totale: € {stats.total.toFixed(2)}
          </p>
        </div>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="grid2">
        <div className="card">
          <h2>Aggiungi spesa</h2>

          <form onSubmit={handleAddExpense}>
            <label className="label">Descrizione</label>
            <input
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="label">Importo</label>
            <input
              className="input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="label">Pagato da</label>
            <input
              className="input"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="label">Partecipanti (separati da virgola)</label>
            <input
              className="input"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Es. Luca, Anna, Marco"
            />

            <div style={{ height: 16 }} />

            <button className="btn btnPrimary">Aggiungi</button>

            {error && <div className="alert">{error}</div>}
          </form>
        </div>

        <div className="card">
          <h2>Lista spese</h2>

          {expenses.length === 0 ? (
            <p>Nessuna spesa inserita.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Descrizione</th>
                  <th>Importo</th>
                  <th>Pagato da</th>
                  <th>Partecipanti</th>
                  <th>Quota (€/persona)</th>
                  <th>Azioni</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => {
                  const ppl = Array.isArray(exp.participants) ? exp.participants : [];
                  const split = getSplitAmount(exp);

                  return (
                    <tr key={exp._id}>
                      <td data-label="Descrizione">
                        <strong>{exp.description}</strong>
                      </td>
                      <td data-label="Importo">
                        € {Number(exp.amount || 0).toFixed(2)}
                      </td>
                      <td data-label="Pagato da">{exp.paidBy}</td>
                      <td data-label="Partecipanti">{ppl.join(", ")}</td>
                      <td data-label="Quota (€/persona)">
                        € {Number(split || 0).toFixed(2)}
                      </td>
                      <td data-label="Azioni">
                        <button
                          className="btn"
                          onClick={() => handleDeleteExpense(exp._id)}
                          style={{
                            background: "rgba(220,38,38,.10)",
                            borderColor: "rgba(220,38,38,.25)",
                            color: "#991b1b",
                          }}
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      
      {showDeleteModal && (
        <div
          className="modalOverlay"
          onClick={() => {
            setShowDeleteModal(false);
            setExpenseToDelete(null);
          }}
        >
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">Eliminare questa spesa?</div>
            <div className="modalText">Questa azione non può essere annullata.</div>

            <div className="modalActions">
              <button
                className="btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setExpenseToDelete(null);
                }}
              >
                Annulla
              </button>

              <button className="btn btnDanger" onClick={confirmDelete}>
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;