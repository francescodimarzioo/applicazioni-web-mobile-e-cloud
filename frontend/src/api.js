const API_URL = "http://localhost:3001";

export async function getExpenses() {
  return fetch(API_URL + "/expenses")
}

export async function addExpense(expense) {
 return fetch(API_URL + "/expenses")
}