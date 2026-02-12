const API_URL = "http://localhost:3001";

export async function getExpenses() {
  return fetch(${API_URL}/expenses).then(r => r.json());
}

export async function addExpense(expense) {
  return fetch(${API_URL}/expenses, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  });
}