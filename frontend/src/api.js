const API_URL = "http://localhost:3001";

export async function getExpenses() {
  const response = await fetch(API_URL + "/expenses");
  return response.json();
}

export async function addExpense(expense) {
  await fetch(API_URL + "/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expense)
  });
}